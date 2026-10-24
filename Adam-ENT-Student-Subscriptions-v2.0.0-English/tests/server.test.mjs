import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, mkdir, writeFile, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createPublicKey, verify, createHash } from 'node:crypto';
import { once } from 'node:events';
import { createServer, addCalendarMonths } from '../server/server.mjs';
import { resetPassword, resetDevices } from '../server/cli.mjs';

const PASSWORD = 'Correct Horse 37!';
const ADMIN = 'test-administrative-token-32-characters-minimum';
const DEVICE = 'test-device-00000001';
async function fixture(t, envOverrides = {}) {
  const dir = await mkdtemp(join(tmpdir(), 'adam-api-test-'));
  const studentDir = join(dir, 'student');
  const websiteDir = join(dir, 'website');
  const dataDir = join(dir, 'private');
  await mkdir(studentDir); await mkdir(websiteDir); await mkdir(dataDir);
  await writeFile(join(studentDir, 'index.html'), '<!doctype html><h1>Student</h1>');
  await writeFile(join(websiteDir, 'index.html'), '<!doctype html><h1>Website</h1>');
  await writeFile(join(dataDir, 'secret.json'), '{"private":true}');
  let clock = Math.floor(Date.UTC(2026, 0, 31, 12) / 1000);
  let published = null;
  const bankService = {
    async loadPublishedBank() { return published; },
    async publishBank(bytes, filename, directory) {
      assert.equal(directory, dataDir);
      const path = join(dataDir, 'bank.json');
      await writeFile(path, bytes);
      const metadata = { id: 'main', title: filename, version: '1', questionCount: 1, imageCount: 0, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), downloadUrl: '/api/bank/download' };
      published = { metadata, path };
      return metadata;
    }
  };
  const options = { env: { NODE_ENV: 'test', PAYMENT_MODE: 'sandbox', ...envOverrides }, adminToken: ADMIN, dataDir, studentDir, websiteDir, now: () => clock, bankService };
  let server = await createServer(options);
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  let base = `http://127.0.0.1:${server.address().port}`;
  async function request(path, { method = 'GET', body, session, headers = {}, raw } = {}) {
    const nextHeaders = { ...headers };
    if (session) { nextHeaders.Authorization = `Bearer ${session.token}`; nextHeaders['X-Device-Id'] = session.deviceId || DEVICE; }
    if (body !== undefined || method === 'DELETE' || method === 'POST') nextHeaders['Content-Type'] ||= 'application/json';
    const response = await fetch(base + path, { method, headers: nextHeaders, body: raw ?? (body === undefined ? undefined : JSON.stringify(body)) });
    const text = await response.text();
    let data; try { data = JSON.parse(text); } catch { data = text; }
    return { status: response.status, data, text, headers: response.headers };
  }
  async function register(email = 'student@example.com', deviceId = DEVICE) {
    const result = await request('/api/auth/register', { method: 'POST', body: { name: 'Student', email, password: PASSWORD, deviceId, deviceName: 'Test device' } });
    assert.equal(result.status, 201, result.text);
    return { ...result.data, deviceId };
  }
  async function login(email = 'student@example.com', deviceId = DEVICE, password = PASSWORD) {
    return request('/api/auth/login', { method: 'POST', body: { email, password, deviceId, deviceName: 'Other device' } });
  }
  async function order(session, planId = 'quarterly') {
    const result = await request('/api/orders', { method: 'POST', session, body: { planId, amount: 1, currency: 'USD' } });
    assert.equal(result.status, 201, result.text); return result.data.order;
  }
  async function confirm(session, id, outcome = 'paid') {
    return request(`/api/orders/${id}/sandbox-confirm`, { method: 'POST', session, body: { outcome } });
  }
  async function close() {
    if (!server.listening) return;
    await new Promise((resolveClose, reject) => server.close(error => error ? reject(error) : resolveClose()));
  }
  t.after(async () => { await close(); await rm(dir, { recursive: true, force: true }); });
  return { request, register, login, order, confirm, get server() { return server; }, dataDir, studentDir, setNow(value) { clock = value; }, now: () => clock, async restart() {
    await close(); server = await createServer(options); server.listen(0, '127.0.0.1'); await once(server, 'listening'); base = `http://127.0.0.1:${server.address().port}`;
  } };
}
function decode(token) { return JSON.parse(Buffer.from(token.split('.')[1], 'base64url')); }

test('register/login uses unique salted scrypt hashes and hashed bearer sessions', async t => {
  const f = await fixture(t);
  const alice = await f.register();
  const bob = await f.register('second@example.com');
  assert.equal(alice.subscription.active, false);
  assert.equal(alice.license, null);
  const users = f.server.context.db.prepare('SELECT password_hash FROM users').all();
  assert.notEqual(users[0].password_hash, users[1].password_hash);
  assert.match(users[0].password_hash, /^scrypt:16384:8:1:/);
  const sessions = f.server.context.db.prepare('SELECT token_hash FROM sessions').all();
  assert.ok(sessions.every(row => row.token_hash !== alice.token && row.token_hash !== bob.token && /^[0-9a-f]{64}$/.test(row.token_hash)));
  const login = await f.login();
  assert.equal(login.status, 200);
  assert.equal(login.data.user.id, alice.user.id);
  assert.notEqual(login.data.token, alice.token);
  const weak = await f.request('/api/auth/register', { method: 'POST', body: { name: 'x', email: 'weak@example.com', password: 'short', deviceId: DEVICE } });
  assert.equal(weak.status, 400);
});

test('unknown and wrong-password login return the same generic error', async t => {
  const f = await fixture(t); await f.register();
  const wrong = await f.login('student@example.com', DEVICE, 'Wrong Password 12');
  const absent = await f.login('unknown@example.com', DEVICE, 'Wrong Password 12');
  assert.equal(wrong.status, 401); assert.deepEqual(wrong.data, absent.data);
  assert.equal(wrong.data.error.code, 'invalid_credentials');
});

test('session is bound to X-Device-Id and expires after 30 days', async t => {
  const f = await fixture(t); const user = await f.register();
  assert.equal((await f.request('/api/me', { session: user })).status, 200);
  assert.equal((await f.request('/api/me', { session: { ...user, deviceId: 'incorrect-device-12345' } })).status, 401);
  f.setNow(f.now() + 31 * 86400);
  assert.equal((await f.request('/api/me', { session: user })).status, 401);
});

test('device limit, owner isolation and revocation invalidate all selected-device sessions', async t => {
  const f = await fixture(t); const user = await f.register();
  const second = await f.login('student@example.com', 'test-device-00000002');
  assert.equal(second.status, 200);
  const third = await f.login('student@example.com', 'test-device-00000003');
  assert.equal(third.status, 409); assert.equal(third.data.error.code, 'device_limit');
  const list = await f.request('/api/devices', { session: user });
  assert.equal(list.data.devices.length, 2); assert.equal(list.data.devices.filter(d => d.current).length, 1);
  const outsider = await f.register('outsider@example.com', 'outsider-device-00001');
  assert.equal((await f.request(`/api/devices/test-device-00000002`, { method: 'DELETE', session: outsider })).status, 404);
  assert.equal((await f.request(`/api/devices/test-device-00000002`, { method: 'DELETE', session: user })).status, 200);
  assert.equal((await f.request('/api/me', { session: { ...second.data, deviceId: 'test-device-00000002' } })).status, 401);
  assert.equal((await f.login('student@example.com', 'test-device-00000003')).status, 200);
});

test('server prices are authoritative and unpaid/pending/failed orders never grant', async t => {
  const f = await fixture(t); const user = await f.register();
  const order = await f.order(user);
  assert.equal(order.amount, 15000); assert.equal(order.currency, 'IQD'); assert.equal(order.status, 'pending');
  assert.equal((await f.request('/api/me', { session: user })).data.subscription.active, false);
  assert.equal((await f.confirm(user, order.id, 'pending')).data.subscription.active, false);
  assert.equal((await f.confirm(user, order.id, 'failed')).data.order.status, 'failed');
  assert.equal((await f.confirm(user, order.id)).status, 409);
  assert.equal((await f.request('/api/license/refresh', { method: 'POST', session: user, body: { deviceId: DEVICE } })).status, 403);
});

test('paid confirmation is idempotent and extends by exact calendar months', async t => {
  const f = await fixture(t); const user = await f.register(); const order = await f.order(user);
  const paid = await f.confirm(user, order.id);
  assert.equal(paid.status, 200); assert.equal(paid.data.subscription.active, true);
  const firstExpiry = Math.floor(Date.UTC(2026, 3, 30, 12) / 1000);
  assert.equal(paid.data.subscription.expiresAt, firstExpiry);
  const repeat = await f.confirm(user, order.id);
  assert.equal(repeat.data.subscription.expiresAt, firstExpiry);
  const annual = await f.order(user, 'annual'); assert.equal(annual.amount, 50000);
  const extended = await f.confirm(user, annual.id);
  assert.equal(extended.data.subscription.expiresAt, Math.floor(Date.UTC(2027, 3, 30, 12) / 1000));
  assert.equal(addCalendarMonths(Math.floor(Date.UTC(2024, 1, 29, 8) / 1000), 12), Math.floor(Date.UTC(2025, 1, 28, 8) / 1000));
});

test('signed licenses independently verify ES256 P1363, scope and seven-day expiry', async t => {
  const f = await fixture(t); const user = await f.register(); const order = await f.order(user);
  const paid = await f.confirm(user, order.id); const token = paid.data.license;
  const [head, body, signature] = token.split('.');
  const config = (await f.request('/api/config')).data;
  const publicKey = createPublicKey({ key: config.publicKey, format: 'jwk' });
  assert.equal(Buffer.from(signature, 'base64url').length, 64);
  assert.equal(verify('sha256', Buffer.from(`${head}.${body}`), { key: publicKey, dsaEncoding: 'ieee-p1363' }, Buffer.from(signature, 'base64url')), true);
  assert.equal(verify('sha256', Buffer.from(`${head}.${body}x`), { key: publicKey, dsaEncoding: 'ieee-p1363' }, Buffer.from(signature, 'base64url')), false);
  const payload = decode(token);
  assert.deepEqual({ iss: payload.iss, aud: payload.aud, sub: payload.sub, deviceId: payload.deviceId, licenseVersion: payload.licenseVersion }, { iss: 'adam-ent', aud: 'adam-ent-student', sub: user.user.id, deviceId: DEVICE, licenseVersion: 1 });
  assert.equal(payload.exp - payload.iat, 7 * 86400);
  f.setNow(paid.data.subscription.expiresAt - 100);
  const last = await f.request('/api/auth/login', { method: 'POST', body: { email: 'student@example.com', password: PASSWORD, deviceId: DEVICE } });
  assert.equal(decode(last.data.license).exp, paid.data.subscription.expiresAt);
});

test('only owner can inspect or confirm an order', async t => {
  const f = await fixture(t); const first = await f.register(); const other = await f.register('other@example.com'); const order = await f.order(first);
  assert.equal((await f.request(`/api/orders/${order.id}`, { session: other })).status, 404);
  assert.equal((await f.confirm(other, order.id)).status, 404);
  assert.equal((await f.request(`/api/orders/${order.id}`, { session: first })).status, 200);
});

test('production disables sandbox routes even when sandbox environment was requested', async t => {
  const f = await fixture(t, { NODE_ENV: 'production', PAYMENT_MODE: 'sandbox', PUBLIC_URL: 'https://api.example.test', WEBSITE_URL: 'https://example.test' });
  const user = await f.register();
  const config = await f.request('/api/config'); assert.equal(config.data.paymentMode, 'disabled');
  assert.equal((await f.request('/api/orders', { method: 'POST', session: user, body: { planId: 'annual' } })).status, 503);
  assert.equal((await f.confirm(user, 'not-real-order')).status, 404);
  assert.match(config.headers.get('strict-transport-security'), /max-age/);
  const injected = await f.request('/student/config.js', { headers: { Host: 'untrusted.example' } });
  assert.match(injected.text, /"apiBaseUrl":"https:\/\/api.example.test"/);
  assert.doesNotMatch(injected.text, /untrusted.example/);
});

test('production requires HTTPS, strong admin secret, and no development LAN HTTP', async () => {
  await assert.rejects(createServer({ env: { NODE_ENV: 'production', PUBLIC_URL: 'http://localhost:8787' } }), /production_requires_https/);
  await assert.rejects(createServer({ env: { NODE_ENV: 'production', PUBLIC_URL: 'https://api.example.test' } }), /production_requires_admin_token/);
  await assert.rejects(createServer({ env: { NODE_ENV: 'test', PUBLIC_URL: 'http://192.168.1.2:8787' } }), /http_loopback_only/);
});

test('bank access requires live entitlement; downloaded bytes match published metadata', async t => {
  const f = await fixture(t); const user = await f.register();
  assert.equal((await f.request('/api/bank', { session: user })).status, 403);
  assert.equal((await f.request('/api/admin/bank', { method: 'POST', raw: '{"questions":[{}]}', headers: { Authorization: `Bearer ${ADMIN}`, 'X-Filename': encodeURIComponent('Book Bank.json'), 'Content-Type': 'application/json' } })).status, 201);
  const order = await f.order(user); const paid = await f.confirm(user, order.id);
  const metadata = await f.request('/api/bank', { session: user }); assert.equal(metadata.status, 200); assert.equal(metadata.data.title, 'Book Bank.json');
  assert.equal(Object.hasOwn(metadata.data, 'path'), false);
  const download = await f.request('/api/bank/download', { session: user });
  assert.equal(createHash('sha256').update(download.text).digest('hex'), metadata.data.sha256);
  assert.equal(download.headers.get('cache-control'), 'no-store');
  f.setNow(paid.data.subscription.expiresAt + 1);
  const again = await f.login(); const fresh = { ...again.data, deviceId: DEVICE };
  assert.equal((await f.request('/api/bank/download', { session: fresh })).status, 403);
  assert.equal((await f.request('/api/me', { session: fresh })).data.license, null);
});

test('admin revoke blocks new licenses and bank downloads immediately online', async t => {
  const f = await fixture(t); const user = await f.register(); await f.confirm(user, (await f.order(user)).id);
  assert.equal((await f.request('/api/admin/status')).status, 401);
  const status = await f.request('/api/admin/status', { headers: { Authorization: `Bearer ${ADMIN}` } }); assert.equal(status.data.activeSubscriptions, 1);
  const revoked = await f.request('/api/admin/entitlements/revoke', { method: 'POST', headers: { Authorization: `Bearer ${ADMIN}` }, body: { userId: user.user.id } }); assert.equal(revoked.status, 200);
  assert.equal((await f.request('/api/license/refresh', { method: 'POST', session: user, body: { deviceId: DEVICE } })).status, 403);
  assert.equal((await f.request('/api/bank', { session: user })).status, 403);
});

test('account deletion requires password and cascades private account rows', async t => {
  const f = await fixture(t); const user = await f.register(); await f.confirm(user, (await f.order(user)).id);
  assert.equal((await f.request('/api/account', { method: 'DELETE', session: user, body: { password: 'not the password' } })).status, 401);
  assert.equal((await f.request('/api/account', { method: 'DELETE', session: user, body: { password: PASSWORD } })).status, 200);
  for (const table of ['users', 'sessions', 'devices', 'orders', 'entitlements']) assert.equal(f.server.context.db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get().n, 0);
  assert.equal((await f.request('/api/me', { session: user })).status, 401);
});

test('CLI password reset revokes all sessions and old password fails', async t => {
  const f = await fixture(t); const user = await f.register();
  await resetPassword(f.dataDir, 'student@example.com', 'New Strong Password 40!');
  assert.equal((await f.request('/api/me', { session: user })).status, 401);
  assert.equal((await f.login()).status, 401);
  assert.equal((await f.login('student@example.com', DEVICE, 'New Strong Password 40!')).status, 200);
});

test('CLI device reset recovers a full account without changing its entitlement or password', async t => {
  const f = await fixture(t); const user = await f.register();
  const second = await f.login('student@example.com', 'test-device-00000002'); assert.equal(second.status, 200);
  const paid = await f.confirm(user, (await f.order(user)).id);
  assert.equal((await f.login('student@example.com', 'replacement-device-00003')).status, 409);
  const reset = resetDevices(f.dataDir, 'student@example.com', f.now());
  assert.equal(reset.revokedDevices, 2);
  assert.equal((await f.request('/api/me', { session: user })).status, 401);
  assert.equal((await f.request('/api/me', { session: { ...second.data, deviceId: 'test-device-00000002' } })).status, 401);
  const recovered = await f.login('student@example.com', 'replacement-device-00003');
  assert.equal(recovered.status, 200);
  assert.equal(recovered.data.subscription.expiresAt, paid.data.subscription.expiresAt);
  assert.equal(recovered.data.subscription.active, true);
  assert.equal(recovered.data.devices.length, 1);
  assert.equal(f.server.context.db.prepare('SELECT COUNT(*) AS count FROM orders WHERE user_id=?').get(user.user.id).count, 1);
});

test('database, signing key and paid entitlement survive restart', async t => {
  const f = await fixture(t); const user = await f.register(); const paid = await f.confirm(user, (await f.order(user)).id);
  const before = (await f.request('/api/config')).data.publicKey;
  await f.restart();
  const after = await f.request('/api/me', { session: user }); assert.equal(after.status, 200); assert.equal(after.data.subscription.expiresAt, paid.data.subscription.expiresAt);
  assert.deepEqual((await f.request('/api/config')).data.publicKey, before);
});

test('CORS is exact allowlist; static traversal and secrets are not exposed', async t => {
  const f = await fixture(t, { CORS_ORIGINS: 'https://appassets.androidplatform.net' });
  assert.equal((await f.request('/api/config', { headers: { Origin: 'https://evil.example' } })).status, 403);
  const native = await f.request('/api/config', { headers: { Origin: 'https://appassets.androidplatform.net' } });
  assert.equal(native.headers.get('access-control-allow-origin'), 'https://appassets.androidplatform.net');
  assert.equal((await f.request('/student/')).status, 200);
  assert.equal((await f.request('/')).status, 200);
  for (const path of ['/server/server.mjs', '/runtime-data/license-private.pem', '/private/secret.json', '/student/..%5cprivate%5csecret.json', '/.env', '/student/.env']) assert.equal((await f.request(path)).status, 404, path);
  const config = await f.request('/student/config.js'); assert.equal(config.status, 200); assert.match(config.text, /publicKey/); assert.doesNotMatch(config.text, /PRIVATE KEY/);
  assert.equal((await f.request('/student/%zz')).status, 400);
  await symlink(f.dataDir, join(f.studentDir, 'linked-private'), process.platform === 'win32' ? 'junction' : 'dir');
  assert.equal((await f.request('/student/linked-private/secret.json')).status, 404);
});

test('empty-body logout succeeds and revokes session without requiring a content type', async t => {
  const f = await fixture(t); const user = await f.register();
  const response = await fetch(`http://127.0.0.1:${f.server.address().port}/api/auth/logout`, { method: 'POST', headers: { Authorization: `Bearer ${user.token}`, 'X-Device-Id': DEVICE } });
  assert.equal(response.status, 200);
  assert.equal((await f.request('/api/me', { session: user })).status, 401);
});

test('bounded JSON, required content type and security headers', async t => {
  const f = await fixture(t);
  const malformed = await f.request('/api/auth/login', { method: 'POST', raw: '{bad', headers: { 'Content-Type': 'application/json' } }); assert.equal(malformed.status, 400);
  const wrongType = await f.request('/api/auth/login', { method: 'POST', raw: '{}', headers: { 'Content-Type': 'text/plain' } }); assert.equal(wrongType.status, 415);
  const large = await f.request('/api/auth/login', { method: 'POST', raw: JSON.stringify({ text: 'x'.repeat(33000) }), headers: { 'Content-Type': 'application/json' } }); assert.equal(large.status, 413);
  const health = await f.request('/api/health'); assert.equal(health.headers.get('x-content-type-options'), 'nosniff'); assert.equal(health.headers.get('x-frame-options'), 'DENY'); assert.match(health.headers.get('content-security-policy'), /frame-ancestors 'none'/);
});

test('authentication throttles repeated attempts', async t => {
  const f = await fixture(t);
  let last;
  for (let i = 0; i < 13; i++) last = await f.login('missing@example.com', DEVICE, 'Wrong Password 12');
  assert.equal(last.status, 429); assert.equal(last.data.error.code, 'rate_limited');
});

test('trusted reverse proxy separates authentication quotas by one valid X-Real-IP', async t => {
  const f = await fixture(t, { TRUST_PROXY_IPS: '127.0.0.1' });
  async function probe(ip, number) {
    return f.request('/api/auth/login', { method: 'POST', headers: { 'X-Real-IP': ip }, body: { email: `proxy-probe-${number}@example.com`, password: PASSWORD, deviceId: DEVICE } });
  }
  for (let index = 0; index < 30; index++) assert.equal((await probe('198.51.100.10', index)).status, 401);
  assert.equal((await probe('198.51.100.10', 30)).status, 429);
  assert.equal((await probe('198.51.100.11', 31)).status, 401);
});

test('untrusted callers cannot rotate forged forwarding headers to bypass the shared socket quota', async t => {
  const f = await fixture(t);
  for (let index = 0; index <= 30; index++) {
    const result = await f.request('/api/auth/login', { method: 'POST', headers: { 'X-Real-IP': `198.51.100.${index + 1}`, 'X-Forwarded-For': `203.0.113.${index + 1}` }, body: { email: `direct-probe-${index}@example.com`, password: PASSWORD, deviceId: DEVICE } });
    assert.equal(result.status, index < 30 ? 401 : 429);
  }
});

test('trusted proxy rejects malformed or multi-valued client addresses and never trusts X-Forwarded-For', async t => {
  const f = await fixture(t, { TRUST_PROXY_IPS: '127.0.0.1' });
  const malformed = ['not-an-ip', '198.51.100.10, 198.51.100.11', '198.51.100.10:443', ''];
  for (let index = 0; index <= 30; index++) {
    const result = await f.request('/api/auth/login', { method: 'POST', headers: { 'X-Real-IP': malformed[index % malformed.length], 'X-Forwarded-For': `203.0.113.${index + 1}` }, body: { email: `bad-proxy-${index}@example.com`, password: PASSWORD, deviceId: DEVICE } });
    assert.equal(result.status, index < 30 ? 401 : 429);
  }
});

test('trusted proxy general-request quota also isolates effective client IPs', async t => {
  const f = await fixture(t, { TRUST_PROXY_IPS: '127.0.0.1' });
  for (let batch = 0; batch < 20; batch++) {
    const results = await Promise.all(Array.from({ length: 30 }, () => f.request('/api/health', { headers: { 'X-Real-IP': '198.51.100.20' } })));
    assert.ok(results.every(result => result.status === 200));
  }
  assert.equal((await f.request('/api/health', { headers: { 'X-Real-IP': '198.51.100.20' } })).status, 429);
  assert.equal((await f.request('/api/health', { headers: { 'X-Real-IP': '198.51.100.21' } })).status, 200);
});

test('trusted proxy configuration accepts exact IP addresses only', async () => {
  for (const value of ['127.0.0.1/8', 'localhost', '*', '198.51.100.1:80']) {
    await assert.rejects(createServer({ env: { NODE_ENV: 'test', TRUST_PROXY_IPS: value } }), /exact IP addresses/);
  }
});
