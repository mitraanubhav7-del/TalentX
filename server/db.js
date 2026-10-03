import 'dotenv/config';
import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const databasePath = path.resolve(process.env.TALENTX_DB_PATH || 'data/talentx.sqlite');
mkdirSync(path.dirname(databasePath), { recursive: true });

export const db = new Database(databasePath);

function hasColumn(database, table, column) {
  return database.prepare(`PRAGMA table_info(${table})`).all().some(entry => entry.name === column);
}

export function initializeDatabase(database = db) {
  database.pragma('journal_mode = WAL');
  database.pragma('foreign_keys = ON');
  database.pragma('busy_timeout = 5000');

  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL COLLATE NOCASE UNIQUE,
      role TEXT NOT NULL CHECK (role IN ('candidate', 'recruiter')),
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      approved INTEGER NOT NULL DEFAULT 1 CHECK (approved IN (0, 1)),
      recruiter_status TEXT NOT NULL DEFAULT 'approved'
        CHECK (recruiter_status IN ('pending', 'approved', 'rejected')),
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS administrators (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL COLLATE NOCASE UNIQUE,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      admin_id INTEGER REFERENCES administrators(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      last_seen_at INTEGER NOT NULL,
      CHECK ((user_id IS NOT NULL AND admin_id IS NULL) OR (user_id IS NULL AND admin_id IS NOT NULL))
    );

  `);

  if (!hasColumn(database, 'users', 'recruiter_status')) {
    database.exec(`
      ALTER TABLE users ADD COLUMN recruiter_status TEXT NOT NULL DEFAULT 'approved'
        CHECK (recruiter_status IN ('pending', 'approved', 'rejected'));
      UPDATE users SET recruiter_status = CASE
        WHEN role = 'recruiter' AND approved = 0 THEN 'pending'
        ELSE 'approved'
      END;
    `);
  }

  if (!hasColumn(database, 'sessions', 'admin_id')) {
    database.exec('ALTER TABLE sessions ADD COLUMN admin_id INTEGER REFERENCES administrators(id) ON DELETE CASCADE');
  }

  const userIdColumn = database.prepare('PRAGMA table_info(sessions)').all()
    .find(entry => entry.name === 'user_id');
  if (userIdColumn?.notnull) {
    database.pragma('foreign_keys = OFF');
    try {
      database.transaction(() => {
        database.exec(`
          CREATE TABLE sessions_new (
            token_hash TEXT PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            admin_id INTEGER REFERENCES administrators(id) ON DELETE CASCADE,
            expires_at INTEGER NOT NULL,
            created_at INTEGER NOT NULL,
            last_seen_at INTEGER NOT NULL,
            CHECK ((user_id IS NOT NULL AND admin_id IS NULL) OR (user_id IS NULL AND admin_id IS NOT NULL))
          );
          INSERT INTO sessions_new (token_hash, user_id, admin_id, expires_at, created_at, last_seen_at)
          SELECT token_hash, user_id, NULL, expires_at, created_at, created_at FROM sessions;
          DROP TABLE sessions;
          ALTER TABLE sessions_new RENAME TO sessions;
        `);
      })();
    } finally {
      database.pragma('foreign_keys = ON');
    }
  }

  if (!hasColumn(database, 'sessions', 'last_seen_at')) {
    database.exec('ALTER TABLE sessions ADD COLUMN last_seen_at INTEGER NOT NULL DEFAULT 0');
    database.exec('UPDATE sessions SET last_seen_at = created_at WHERE last_seen_at = 0');
  }

  database.exec(`
    CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS sessions_admin_id_idx ON sessions(admin_id);
    CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);
    CREATE INDEX IF NOT EXISTS recruiters_status_idx ON users(role, recruiter_status);
  `);
}

initializeDatabase();
