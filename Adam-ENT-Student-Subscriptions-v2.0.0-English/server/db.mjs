import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
export function openDatabase(dataDir) {
  mkdirSync(dataDir, { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(join(dataDir, 'adam.sqlite'));
  db.exec(`
    PRAGMA foreign_keys=ON;
    PRAGMA journal_mode=WAL;
    PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
      password_hash TEXT NOT NULL, created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS devices (
      id TEXT NOT NULL, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL, created_at INTEGER NOT NULL, last_seen INTEGER NOT NULL, revoked_at INTEGER,
      PRIMARY KEY(user_id,id)
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      device_id TEXT NOT NULL, created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL,
      FOREIGN KEY(user_id,device_id) REFERENCES devices(user_id,id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS entitlements (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL, revoked_at INTEGER, updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      plan_id TEXT NOT NULL, amount INTEGER NOT NULL, currency TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('pending','paid','failed','cancelled')),
      payment_mode TEXT NOT NULL, created_at INTEGER NOT NULL, paid_at INTEGER,
      subscription_expires_at INTEGER
    );
    CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS orders_user ON orders(user_id,created_at);
  `);
  return db;
}
export function transaction(db, operation) {
  db.exec('BEGIN IMMEDIATE');
  try { const result = operation(); db.exec('COMMIT'); return result; }
  catch (error) { db.exec('ROLLBACK'); throw error; }
}
