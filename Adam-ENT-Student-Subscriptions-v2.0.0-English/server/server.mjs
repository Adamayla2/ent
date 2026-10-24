import http from 'node:http';
import { createReadStream, existsSync, statSync, realpathSync } from 'node:fs';
import { resolve, dirname, extname, basename, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { isIP } from 'node:net';
import { openDatabase, transaction } from './db.mjs';
import { hashPassword, checkPassword, validatePassword, newToken, hashToken, constantEqual, signingKeys, RateLimiter } from './security.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const DAY = 86400;
export const PLANS = Object.freeze([
  Object.freeze({ id: 'quarterly', name: 'Three months', amount: 15000, currency: 'IQD', months: 3 }),
  Object.freeze({ id: 'annual', name: 'One year', amount: 50000, currency: 'IQD', months: 12 })
]);
export function addCalendarMonths(timestamp, months) {
  const original = new Date(timestamp * 1000);
  const result = new Date(original);
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);
  const last = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
  result.setUTCDate(Math.min(original.getUTCDate(), last));
  return Math.floor(result.getTime() / 1000);
}
class ApiError extends Error {
  constructor(status, code, message = code) { super(message); this.status = status; this.code = code; }
}
function requireCondition(condition, status, code, message) { if (!condition) throw new ApiError(status, code, message); }
function readBody(req, maxBytes = 32768, raw = false) {
  return new Promise((resolveBody, reject) => {
    let size = 0;
    const chunks = [];
    let failed = false;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > maxBytes) {
        if (!failed) reject(new ApiError(413, 'body_too_large'));
        failed = true;
      } else if (!failed) chunks.push(chunk);
    });
    req.on('end', () => {
      if (failed) return;
      const bytes = Buffer.concat(chunks);
      if (raw) return resolveBody(bytes);
      try {
        const value = bytes.length ? JSON.parse(bytes.toString('utf8')) : {};
        requireCondition(value && typeof value === 'object' && !Array.isArray(value), 400, 'invalid_json');
        resolveBody(value);
      } catch { reject(new ApiError(400, 'invalid_json')); }
    });
    req.on('error', () => reject(new ApiError(400, 'invalid_body')));
  });
}
function emailValue(value) {
  const email = typeof value === 'string' ? value.trim().toLowerCase() : '';
  requireCondition(email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 400, 'invalid_email');
  return email;
}
function deviceInput(body) {
  requireCondition(typeof body.deviceId === 'string' && /^[A-Za-z0-9_-]{16,128}$/.test(body.deviceId), 400, 'invalid_device');
  return { id: body.deviceId, name: typeof body.deviceName === 'string' ? body.deviceName.trim().slice(0, 80) || 'Student device' : 'Student device' };
}
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8' };
function isContained(root, target) {
  const child = relative(root, target);
  return child.length > 0 && child !== '..' && !child.startsWith('..\\') && !child.startsWith('../') && !isAbsolute(child);
}
function proxyAllowlist(value) {
  const result = new Set();
  for (const ip of String(value || '').split(',').map(part => part.trim()).filter(Boolean)) {
    requireCondition(isIP(ip) !== 0 && !ip.includes('%'), 500, 'invalid_trusted_proxy_ip', 'TRUST_PROXY_IPS must contain exact IP addresses, without CIDR ranges or zone identifiers.');
    result.add(ip);
  }
  return result;
}
function clientAddress(req, trustedProxies) {
  const peer = req.socket.remoteAddress || 'unknown';
  if (!trustedProxies.has(peer)) return peer;
  const header = req.headers['x-real-ip'];
  if (typeof header !== 'string' || isIP(header) === 0 || header.includes('%')) return peer;
  let count = 0;
  for (let index = 0; index < req.rawHeaders.length; index += 2) if (req.rawHeaders[index].toLowerCase() === 'x-real-ip') count++;
  return count === 1 ? header : peer;
}

/** Returns a standard http.Server. Call listen() to start and close() to release SQLite. */
export async function createServer(options = {}) {
  const env = options.env || process.env;
  const production = env.NODE_ENV === 'production';
  const publicUrl = new URL(options.publicUrl || env.PUBLIC_URL || 'http://127.0.0.1:8787');
  requireCondition(!production || publicUrl.protocol === 'https:', 500, 'production_requires_https');
  requireCondition(production || (publicUrl.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(publicUrl.hostname)) || publicUrl.protocol === 'https:', 500, 'http_loopback_only');
  const dataDir = resolve(options.dataDir || env.DATA_DIR || resolve(HERE, 'runtime-data'));
  const studentDir = resolve(options.studentDir || resolve(HERE, '../student'));
  const websiteDir = resolve(options.websiteDir || resolve(HERE, '../website'));
  const adminToken = options.adminToken || env.ADMIN_TOKEN || '';
  requireCondition(!production || adminToken.length >= 32, 500, 'production_requires_admin_token');
  const sandbox = (options.paymentMode || env.PAYMENT_MODE) === 'sandbox' && !production;
  const paymentMode = sandbox ? 'sandbox' : 'disabled';
  const websiteUrl = options.websiteUrl || env.WEBSITE_URL || publicUrl.origin;
  requireCondition(!production || new URL(websiteUrl).protocol === 'https:', 500, 'production_requires_https');
  const allowedOrigins = new Set([publicUrl.origin, ...(env.CORS_ORIGINS || '').split(',').map(value => value.trim()).filter(Boolean)]);
  const trustedProxies = proxyAllowlist(env.TRUST_PROXY_IPS);
  const keys = signingKeys(dataDir);
  const db = openDatabase(dataDir);
  const rate = new RateLimiter();
  const clock = options.now || (() => Math.floor(Date.now() / 1000));
  const dummyHash = await hashPassword(newToken());
  let bankService = options.bankService;
  async function bank() {
    if (!bankService) bankService = await import('./bank.mjs');
    return bankService;
  }
  const getUser = id => db.prepare('SELECT id,email,name,created_at FROM users WHERE id=?').get(id);
  const getSubscription = id => {
    const row = db.prepare('SELECT expires_at,revoked_at FROM entitlements WHERE user_id=?').get(id);
    return { active: Boolean(row && !row.revoked_at && row.expires_at > clock()), expiresAt: row?.expires_at || null };
  };
  const getDevices = id => db.prepare('SELECT id,name,created_at AS createdAt,last_seen AS lastSeen,revoked_at AS revokedAt FROM devices WHERE user_id=? AND revoked_at IS NULL ORDER BY created_at').all(id);
  function license(userId, deviceId) {
    const subscription = getSubscription(userId);
    if (!subscription.active) return null;
    const now = clock();
    const payload = { iss: 'adam-ent', aud: 'adam-ent-student', sub: userId, deviceId, iat: now, exp: Math.min(now + 7 * DAY, subscription.expiresAt), subscriptionExpiresAt: subscription.expiresAt, licenseVersion: 1 };
    return keys.sign(payload);
  }
  function accountData(userId, deviceId) {
    return { user: getUser(userId), devices: getDevices(userId).map(device => ({ ...device, current: device.id === deviceId })), subscription: getSubscription(userId), license: license(userId, deviceId), serverTime: clock() };
  }
  function auth(req) {
    const value = req.headers.authorization || '';
    requireCondition(/^Bearer [A-Za-z0-9_-]{43}$/.test(value), 401, 'unauthorized');
    const row = db.prepare(`SELECT s.user_id,s.device_id FROM sessions s JOIN devices d ON d.user_id=s.user_id AND d.id=s.device_id
      WHERE s.token_hash=? AND s.expires_at>? AND d.revoked_at IS NULL`).get(hashToken(value.slice(7)), clock());
    requireCondition(row, 401, 'unauthorized');
    requireCondition(req.headers['x-device-id'] === row.device_id, 401, 'device_mismatch');
    db.prepare('UPDATE devices SET last_seen=? WHERE user_id=? AND id=?').run(clock(), row.user_id, row.device_id);
    return { userId: row.user_id, deviceId: row.device_id, tokenHash: hashToken(value.slice(7)) };
  }
  function admin(req) {
    const supplied = (req.headers.authorization || '').replace(/^Bearer /, '');
    requireCondition(adminToken.length >= 32 && constantEqual(supplied, adminToken), 401, 'unauthorized');
  }
  function attachDevice(userId, device) {
    const existing = db.prepare('SELECT revoked_at FROM devices WHERE user_id=? AND id=?').get(userId, device.id);
    if (!existing || existing.revoked_at) requireCondition(getDevices(userId).length < 2, 409, 'device_limit', 'Remove an existing device before signing in on another.');
    db.prepare(`INSERT INTO devices(id,user_id,name,created_at,last_seen,revoked_at) VALUES(?,?,?,?,?,NULL)
      ON CONFLICT(user_id,id) DO UPDATE SET name=excluded.name,last_seen=excluded.last_seen,revoked_at=NULL`).run(device.id, userId, device.name, clock(), clock());
  }
  function createSession(userId, deviceId) {
    const token = newToken();
    db.prepare('DELETE FROM sessions WHERE expires_at<=?').run(clock());
    db.prepare('INSERT INTO sessions(token_hash,user_id,device_id,created_at,expires_at) VALUES(?,?,?,?,?)').run(hashToken(token), userId, deviceId, clock(), clock() + 30 * DAY);
    return token;
  }
  const orderData = row => ({ id: row.id, planId: row.plan_id, amount: row.amount, currency: row.currency, status: row.status, paymentMode: row.payment_mode, createdAt: row.created_at, paidAt: row.paid_at, subscriptionExpiresAt: row.subscription_expires_at });
  function respond(res, status, value) {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(value));
  }
  function sendFile(req, res, file, type, downloadName) {
    const stat = statSync(file);
    requireCondition(stat.isFile(), 404, 'not_found');
    res.statusCode = 200;
    res.setHeader('Content-Type', type || MIME[extname(file)] || 'application/octet-stream');
    res.setHeader('Content-Length', stat.size);
    if (downloadName) res.setHeader('Content-Disposition', `attachment; filename="${downloadName.replace(/[^A-Za-z0-9._-]/g, '_')}"`);
    if (req.method === 'HEAD') return res.end();
    createReadStream(file).on('error', () => res.destroy()).pipe(res);
  }
  const server = http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https:; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'");
    if (production) res.setHeader('Strict-Transport-Security', 'max-age=31536000');
    try {
      const origin = req.headers.origin;
      if (origin) {
        requireCondition(allowedOrigins.has(origin), 403, 'origin_not_allowed');
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
        res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Filename, X-Device-Id');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
      }
      if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
      const clientIp = clientAddress(req, trustedProxies);
      requireCondition(rate.allow(`ip:${clientIp}`, 600, 60000), 429, 'rate_limited');
      const url = new URL(req.url, publicUrl);
      let path;
      try { path = decodeURIComponent(url.pathname); } catch { throw new ApiError(400, 'invalid_path'); }
      const method = req.method;
      if (path.startsWith('/api/') && ['POST', 'PUT', 'DELETE'].includes(method) && path !== '/api/admin/bank') {
        const ct = (req.headers['content-type'] || '').split(';')[0].trim();
        const optionalBody = (method === 'POST' && path === '/api/auth/logout') || (method === 'DELETE' && path.startsWith('/api/devices/'));
        const bodyPresent = Number(req.headers['content-length']) > 0 || Boolean(req.headers['transfer-encoding']);
        requireCondition(optionalBody && !bodyPresent || ct === 'application/json', 415, 'json_required');
      }
      if (method === 'GET' && path === '/api/health') return respond(res, 200, { ok: true });
      if (method === 'GET' && path === '/api/config') return respond(res, 200, { apiVersion: 1, paymentMode, plans: PLANS, publicKey: keys.publicJwk, serverTime: clock(), offlineDays: 7, deviceLimit: 2, websiteUrl });
      if (method === 'GET' && path === '/api/plans') return respond(res, 200, { plans: PLANS, paymentMode });
      if (method === 'GET' && path === '/api/license/public-key') return respond(res, 200, { publicJwk: keys.publicJwk });
      if (method === 'POST' && ['/api/auth/register', '/api/auth/login'].includes(path)) {
        const body = await readBody(req);
        const email = emailValue(body.email);
        requireCondition(validatePassword(body.password), 400, 'invalid_password', 'Password must contain at least 10 characters.');
        const device = deviceInput(body);
        const ip = clientIp;
        requireCondition(rate.allow(`auth-ip:${ip}`, 30, 15 * 60000) && rate.allow(`auth-mail:${hashToken(email)}`, 12, 15 * 60000), 429, 'rate_limited');
        if (path.endsWith('/register')) {
          const name = typeof body.name === 'string' ? body.name.trim().slice(0, 100) : '';
          requireCondition(name.length > 0, 400, 'invalid_name');
          const passwordHash = await hashPassword(body.password);
          requireCondition(!db.prepare('SELECT id FROM users WHERE email=?').get(email), 409, 'registration_failed', 'Unable to register with these details.');
          const id = randomUUID();
          transaction(db, () => {
            db.prepare('INSERT INTO users(id,email,name,password_hash,created_at) VALUES(?,?,?,?,?)').run(id, email, name, passwordHash, clock());
            attachDevice(id, device);
          });
          const token = createSession(id, device.id);
          return respond(res, 201, { token, ...accountData(id, device.id) });
        }
        const user = db.prepare('SELECT * FROM users WHERE email=?').get(email);
        const valid = await checkPassword(body.password, user?.password_hash || dummyHash);
        requireCondition(user && valid, 401, 'invalid_credentials', 'Email or password is incorrect.');
        transaction(db, () => attachDevice(user.id, device));
        const token = createSession(user.id, device.id);
        return respond(res, 200, { token, ...accountData(user.id, device.id) });
      }
      if (method === 'POST' && path === '/api/auth/logout') {
        const identity = auth(req);
        db.prepare('DELETE FROM sessions WHERE token_hash=?').run(identity.tokenHash);
        return respond(res, 200, { ok: true });
      }
      if (method === 'GET' && ['/api/auth/me', '/api/me'].includes(path)) {
        const identity = auth(req);
        return respond(res, 200, accountData(identity.userId, identity.deviceId));
      }
      if (method === 'POST' && path === '/api/license/refresh') {
        const identity = auth(req);
        const body = await readBody(req);
        requireCondition(!body.deviceId || body.deviceId === identity.deviceId, 401, 'device_mismatch');
        requireCondition(getSubscription(identity.userId).active, 403, 'subscription_required');
        return respond(res, 200, accountData(identity.userId, identity.deviceId));
      }
      if (method === 'GET' && path === '/api/devices') {
        const identity = auth(req);
        return respond(res, 200, { devices: getDevices(identity.userId).map(device => ({ ...device, current: device.id === identity.deviceId })), currentDeviceId: identity.deviceId });
      }
      if (method === 'DELETE' && path.startsWith('/api/devices/')) {
        const identity = auth(req);
        const deviceId = path.slice('/api/devices/'.length);
        const result = db.prepare('UPDATE devices SET revoked_at=? WHERE user_id=? AND id=? AND revoked_at IS NULL').run(clock(), identity.userId, deviceId);
        requireCondition(result.changes > 0, 404, 'not_found');
        db.prepare('DELETE FROM sessions WHERE user_id=? AND device_id=?').run(identity.userId, deviceId);
        return respond(res, 200, { ok: true, devices: getDevices(identity.userId) });
      }
      if (method === 'POST' && path === '/api/auth/password') {
        const identity = auth(req);
        const body = await readBody(req);
        const user = db.prepare('SELECT password_hash FROM users WHERE id=?').get(identity.userId);
        requireCondition(typeof body.currentPassword === 'string' && await checkPassword(body.currentPassword, user.password_hash), 401, 'invalid_credentials');
        requireCondition(validatePassword(body.newPassword), 400, 'invalid_password');
        const nextHash = await hashPassword(body.newPassword);
        transaction(db, () => {
          db.prepare('UPDATE users SET password_hash=? WHERE id=?').run(nextHash, identity.userId);
          db.prepare('DELETE FROM sessions WHERE user_id=?').run(identity.userId);
        });
        return respond(res, 200, { ok: true, signInAgain: true });
      }
      if (method === 'DELETE' && ['/api/account', '/api/auth/account'].includes(path)) {
        const identity = auth(req);
        const body = await readBody(req);
        const user = db.prepare('SELECT password_hash FROM users WHERE id=?').get(identity.userId);
        requireCondition(typeof body.password === 'string' && await checkPassword(body.password, user.password_hash), 401, 'invalid_credentials');
        db.prepare('DELETE FROM users WHERE id=?').run(identity.userId);
        return respond(res, 200, { ok: true });
      }
      if (method === 'POST' && path === '/api/orders') {
        const identity = auth(req);
        const body = await readBody(req);
        const plan = PLANS.find(value => value.id === body.planId);
        requireCondition(plan, 400, 'invalid_plan');
        requireCondition(sandbox, 503, 'payment_not_configured', 'Live payment provider is not configured. No payment has been collected.');
        const id = randomUUID();
        db.prepare('INSERT INTO orders(id,user_id,plan_id,amount,currency,status,payment_mode,created_at) VALUES(?,?,?,?,?,?,?,?)').run(id, identity.userId, plan.id, plan.amount, plan.currency, 'pending', 'sandbox', clock());
        return respond(res, 201, { order: orderData(db.prepare('SELECT * FROM orders WHERE id=?').get(id)), paymentMode, checkoutUrl: `/checkout.html?order=${id}`, sandbox: true });
      }
      if (method === 'GET' && path === '/api/orders') {
        const identity = auth(req);
        return respond(res, 200, { orders: db.prepare('SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC LIMIT 100').all(identity.userId).map(orderData) });
      }
      const orderMatch = /^\/api\/orders\/([A-Za-z0-9-]+)(\/sandbox-confirm)?$/.exec(path);
      if (orderMatch && (method === 'GET' || (method === 'POST' && orderMatch[2]))) {
        if (orderMatch[2]) requireCondition(sandbox, 404, 'not_found');
        const identity = auth(req);
        const order = db.prepare('SELECT * FROM orders WHERE id=? AND user_id=?').get(orderMatch[1], identity.userId);
        requireCondition(order, 404, 'not_found');
        if (method === 'GET') return respond(res, 200, { order: orderData(order) });
        requireCondition(sandbox && order.payment_mode === 'sandbox', 503, 'payment_not_configured');
        const body = await readBody(req);
        requireCondition(['paid', 'failed', 'pending'].includes(body.outcome), 400, 'invalid_outcome');
        requireCondition(order.status === 'pending' || order.status === 'paid', 409, 'order_not_payable');
        if (order.status === 'pending' && body.outcome === 'failed') db.prepare("UPDATE orders SET status='failed' WHERE id=? AND status='pending'").run(order.id);
        if (order.status === 'pending' && body.outcome === 'paid') transaction(db, () => {
          const latest = db.prepare('SELECT status FROM orders WHERE id=?').get(order.id);
          if (latest.status !== 'pending') return;
          const previous = getSubscription(identity.userId);
          const start = previous.active ? previous.expiresAt : clock();
          const expiresAt = addCalendarMonths(start, PLANS.find(value => value.id === order.plan_id).months);
          db.prepare(`INSERT INTO entitlements(user_id,expires_at,revoked_at,updated_at) VALUES(?,?,NULL,?)
            ON CONFLICT(user_id) DO UPDATE SET expires_at=excluded.expires_at,revoked_at=NULL,updated_at=excluded.updated_at`).run(identity.userId, expiresAt, clock());
          db.prepare("UPDATE orders SET status='paid',paid_at=?,subscription_expires_at=? WHERE id=? AND status='pending'").run(clock(), expiresAt, order.id);
        });
        return respond(res, 200, { order: orderData(db.prepare('SELECT * FROM orders WHERE id=?').get(order.id)), ...accountData(identity.userId, identity.deviceId), sandbox: true });
      }
      if (path.startsWith('/api/admin/')) {
        admin(req);
        if (method === 'GET' && path === '/api/admin/status') {
          const published = await (await bank()).loadPublishedBank(dataDir);
          return respond(res, 200, { paymentMode, users: db.prepare('SELECT COUNT(*) AS count FROM users').get().count, activeSubscriptions: db.prepare('SELECT COUNT(*) AS count FROM entitlements WHERE expires_at>? AND revoked_at IS NULL').get(clock()).count, bank: published?.metadata || null });
        }
        if (method === 'POST' && path === '/api/admin/entitlements/revoke') {
          const body = await readBody(req);
          requireCondition(typeof body.userId === 'string' && getUser(body.userId), 404, 'not_found');
          db.prepare('UPDATE entitlements SET revoked_at=?,updated_at=? WHERE user_id=?').run(clock(), clock(), body.userId);
          return respond(res, 200, { ok: true });
        }
        if (method === 'POST' && path === '/api/admin/bank') {
          const buffer = await readBody(req, 150 * 1024 * 1024, true);
          const filename = basename(decodeURIComponent(String(req.headers['x-filename'] || 'questions.json')));
          const metadata = await (await bank()).publishBank(buffer, filename, dataDir);
          return respond(res, 201, { bank: metadata });
        }
        if (method === 'GET' && path === '/api/admin/bank') return respond(res, 200, { bank: (await (await bank()).loadPublishedBank(dataDir))?.metadata || null });
      }
      if (method === 'GET' && path === '/api/bank') {
        const identity = auth(req);
        requireCondition(getSubscription(identity.userId).active, 403, 'subscription_required');
        const metadata = await (await bank()).loadPublishedBank(dataDir);
        requireCondition(metadata, 404, 'bank_not_published');
        return respond(res, 200, metadata.metadata);
      }
      if (method === 'GET' && path === '/api/bank/download') {
        const identity = auth(req);
        requireCondition(getSubscription(identity.userId).active, 403, 'subscription_required');
        const metadata = await (await bank()).loadPublishedBank(dataDir);
        requireCondition(metadata, 404, 'bank_not_published');
        const file = resolve(metadata.path);
        requireCondition(isContained(dataDir, file), 500, 'invalid_bank_metadata');
        requireCondition(existsSync(file), 404, 'bank_not_published');
        requireCondition(isContained(realpathSync(dataDir), realpathSync(file)), 500, 'invalid_bank_metadata');
        return sendFile(req, res, file, 'application/json; charset=utf-8', 'adam-ent-bank.json');
      }
      if (path.startsWith('/api/')) throw new ApiError(404, 'not_found');
      requireCondition(method === 'GET' || method === 'HEAD', 405, 'method_not_allowed');
      if (path === '/student/config.js') {
        res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
        return res.end(`window.ADAM_CONFIG = Object.freeze(${JSON.stringify({ apiBaseUrl: production ? publicUrl.origin : '', websiteUrl, publicKey: keys.publicJwk, paymentMode, distribution: env.DISTRIBUTION || 'play-consumption' }).replace(/</g, '\\u003c')});\n`);
      }
      let root = websiteDir;
      let relative = path === '/' ? 'index.html' : path.slice(1);
      if (path === '/student' || path === '/student/') { root = studentDir; relative = 'index.html'; }
      else if (path.startsWith('/student/')) { root = studentDir; relative = path.slice('/student/'.length); }
      requireCondition(relative && !relative.includes('..') && !relative.includes('\\') && !relative.split('/').some(part => part.startsWith('.')), 404, 'not_found');
      const target = resolve(root, relative);
      requireCondition(isContained(root, target) && MIME[extname(target)] && existsSync(target), 404, 'not_found');
      requireCondition(isContained(realpathSync(root), realpathSync(target)), 404, 'not_found');
      return sendFile(req, res, target);
    } catch (error) {
      if (res.headersSent) return res.destroy();
      const status = error instanceof ApiError ? error.status : (Number.isInteger(error.status) ? error.status : 500);
      const code = error instanceof ApiError ? error.code : (error.code && status < 500 ? error.code : 'internal_error');
      // Never log request bodies, bearer tokens, password hashes or private keys.
      if (status >= 500 && options.onError) options.onError({ code: 'request_failed', status });
      respond(res, status, { error: { code, message: status >= 500 && code === 'internal_error' ? 'The service could not complete this request.' : error.message } });
    }
  });
  server.requestTimeout = 30000;
  server.headersTimeout = 10000;
  server.maxRequestsPerSocket = 100;
  server.context = { db, keys, dataDir, paymentMode, publicJwk: keys.publicJwk };
  server.once('close', () => db.close());
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const server = await createServer();
    const port = Number(process.env.PORT || 8787);
    const host = process.env.HOST || '127.0.0.1';
    if (process.env.NODE_ENV !== 'production' && !['localhost', '127.0.0.1', '::1'].includes(host)) throw new Error('Development HTTP must bind to loopback only.');
    server.listen(port, host, () => console.log(`Adam ENT server listening on ${host}:${port}; payment mode: ${server.context.paymentMode}`));
    for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => server.close(() => process.exit(0)));
  } catch (error) { console.error(`Startup failed: ${error.code || error.message}`); process.exitCode = 1; }
}
