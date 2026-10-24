import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { openDatabase, transaction } from './db.mjs';
import { hashPassword, validatePassword, newToken } from './security.mjs';

export async function resetPassword(dataDir, email, password) {
  if (!validatePassword(password)) throw new Error('Password must be at least 10 characters.');
  const db = openDatabase(dataDir);
  try {
    const user = db.prepare('SELECT id FROM users WHERE email=?').get(String(email).trim().toLowerCase());
    if (!user) throw new Error('Account not found.');
    const passwordHash = await hashPassword(password);
    transaction(db, () => {
      db.prepare('UPDATE users SET password_hash=? WHERE id=?').run(passwordHash, user.id);
      db.prepare('DELETE FROM sessions WHERE user_id=?').run(user.id);
    });
    return { ok: true };
  } finally { db.close(); }
}
export function resetDevices(dataDir, email, now = Math.floor(Date.now() / 1000)) {
  const db = openDatabase(dataDir);
  try {
    const user = db.prepare('SELECT id FROM users WHERE email=?').get(String(email).trim().toLowerCase());
    if (!user) throw new Error('Account not found.');
    return transaction(db, () => {
      const updated = db.prepare('UPDATE devices SET revoked_at=? WHERE user_id=? AND revoked_at IS NULL').run(now, user.id);
      db.prepare('DELETE FROM sessions WHERE user_id=?').run(user.id);
      return { ok: true, revokedDevices: updated.changes };
    });
  } finally { db.close(); }
}
async function hiddenPassword() {
  if (!process.stdin.isTTY) {
    const chunks = [];
    let size = 0;
    for await (const chunk of process.stdin) {
      size += chunk.length;
      if (size > 4096) throw new Error('Password input too long.');
      chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf8').replace(/[\r\n]+$/, '');
  }
  process.stderr.write('New password (hidden, minimum 10 characters): ');
  return new Promise((resolvePassword, reject) => {
    let value = '';
    const input = process.stdin;
    input.setRawMode(true);
    input.setEncoding('utf8');
    input.resume();
    const finish = () => { input.setRawMode(false); input.pause(); input.off('data', onData); process.stderr.write('\n'); };
    const onData = text => {
      for (const character of text) {
        if (character === '\u0003') { finish(); return reject(new Error('Cancelled.')); }
        if (character === '\r' || character === '\n') { finish(); return resolvePassword(value); }
        if (character === '\u007f' || character === '\b') value = value.slice(0, -1);
        else if (value.length < 1024 && character >= ' ') value += character;
      }
    };
    input.on('data', onData);
  });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const command = process.argv[2];
    if (command === 'admin-token') {
      // Intentional one-time secret output for the operator. Store in environment, never source control.
      process.stdout.write(`${newToken()}\n`);
    } else if (command === 'reset-password') {
      const email = process.argv[3];
      if (!email || process.argv.length > 4) throw new Error('Usage: node cli.mjs reset-password user@example.com (password is read securely from stdin).');
      const dataDir = resolve(process.env.DATA_DIR || fileURLToPath(new URL('./runtime-data', import.meta.url)));
      await resetPassword(dataDir, email, await hiddenPassword());
      process.stdout.write('Password updated. All online sessions revoked. Existing offline licenses expire within 7 days.\n');
    } else if (command === 'reset-devices') {
      const email = process.argv[3];
      if (!email || process.argv.length > 4) throw new Error('Usage: node cli.mjs reset-devices user@example.com');
      const dataDir = resolve(process.env.DATA_DIR || fileURLToPath(new URL('./runtime-data', import.meta.url)));
      const result = resetDevices(dataDir, email);
      process.stdout.write(`Reset complete. ${result.revokedDevices} active device(s) and all online sessions revoked. Subscription and local progress are preserved. Existing offline licenses expire within 7 days.\n`);
    } else throw new Error('Usage: node cli.mjs admin-token | reset-password user@example.com | reset-devices user@example.com');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
