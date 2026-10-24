import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash, generateKeyPairSync, createPrivateKey, createPublicKey, sign, verify } from 'node:crypto';
import { promisify } from 'node:util';
import { mkdirSync, readFileSync, writeFileSync, chmodSync } from 'node:fs';
import { join } from 'node:path';

const scrypt = promisify(scryptCallback);
export const newToken = () => randomBytes(32).toString('base64url');
export const hashToken = token => createHash('sha256').update(String(token)).digest('hex');
export function constantEqual(a, b) {
  const first = Buffer.from(String(a));
  const second = Buffer.from(String(b));
  return first.length === second.length && timingSafeEqual(first, second);
}
export function validatePassword(password) {
  return typeof password === 'string' && password.length >= 10 && Buffer.byteLength(password) <= 1024;
}
export async function hashPassword(password) {
  const salt = randomBytes(24);
  const key = await scrypt(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return `scrypt:16384:8:1:${salt.toString('base64url')}:${key.toString('base64url')}`;
}
export async function checkPassword(password, stored) {
  try {
    const [algorithm, n, r, p, salt, expected] = String(stored).split(':');
    if (algorithm !== 'scrypt' || n !== '16384' || r !== '8' || p !== '1') return false;
    const key = await scrypt(password, Buffer.from(salt, 'base64url'), 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
    const target = Buffer.from(expected, 'base64url');
    return target.length === key.length && timingSafeEqual(target, key);
  } catch { return false; }
}
export function signingKeys(dataDir) {
  mkdirSync(dataDir, { recursive: true, mode: 0o700 });
  const path = join(dataDir, 'license-private.pem');
  let privateKey;
  try { privateKey = createPrivateKey(readFileSync(path)); }
  catch (error) {
    if (error.code !== 'ENOENT') throw new Error('Cannot read license signing key');
    const pair = generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
    writeFileSync(path, pair.privateKey.export({ format: 'pem', type: 'pkcs8' }), { flag: 'wx', mode: 0o600 });
    privateKey = pair.privateKey;
  }
  try { chmodSync(path, 0o600); } catch { /* ACLs are deployment-managed on Windows. */ }
  const publicKey = createPublicKey(privateKey);
  const publicJwk = publicKey.export({ format: 'jwk' });
  const kid = hashToken(JSON.stringify({ kty: publicJwk.kty, crv: publicJwk.crv, x: publicJwk.x, y: publicJwk.y })).slice(0, 24);
  publicJwk.kid = kid;
  publicJwk.alg = 'ES256';
  publicJwk.use = 'sig';
  return {
    publicJwk,
    sign(payload) {
      const header = Buffer.from(JSON.stringify({ alg: 'ES256', typ: 'JWT', kid })).toString('base64url');
      const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
      const message = `${header}.${body}`;
      const signature = sign('sha256', Buffer.from(message), { key: privateKey, dsaEncoding: 'ieee-p1363' });
      return `${message}.${signature.toString('base64url')}`;
    },
    verify(token) {
      const [head, body, signature, excess] = String(token).split('.');
      if (!head || !body || !signature || excess) return null;
      try {
        const header = JSON.parse(Buffer.from(head, 'base64url'));
        if (header.alg !== 'ES256' || header.kid !== kid || !verify('sha256', Buffer.from(`${head}.${body}`), { key: publicKey, dsaEncoding: 'ieee-p1363' }, Buffer.from(signature, 'base64url'))) return null;
        return JSON.parse(Buffer.from(body, 'base64url'));
      } catch { return null; }
    }
  };
}

export class RateLimiter {
  constructor() { this.entries = new Map(); }
  allow(key, limit, windowMs, now = Date.now()) {
    const existing = this.entries.get(key);
    if (!existing || existing.reset <= now) { this.entries.set(key, { count: 1, reset: now + windowMs }); return true; }
    if (existing.count >= limit) return false;
    existing.count++;
    if (this.entries.size > 10000) for (const [id, entry] of this.entries) if (entry.reset <= now) this.entries.delete(id);
    return true;
  }
}
