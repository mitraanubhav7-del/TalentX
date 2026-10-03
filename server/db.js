import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  max: Number(process.env.DB_POOL_SIZE || 5),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

export async function initializeDatabase(pool = db) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL CHECK (role IN ('candidate', 'recruiter')),
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      approved BOOLEAN NOT NULL DEFAULT TRUE,
      recruiter_status TEXT NOT NULL DEFAULT 'approved'
        CHECK (recruiter_status IN ('pending', 'approved', 'rejected')),
      created_at BIGINT NOT NULL,
      profile_data JSONB NOT NULL DEFAULT '{}'
    );
    ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_data JSONB NOT NULL DEFAULT '{}';

    CREATE TABLE IF NOT EXISTS administrators (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      created_at BIGINT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      admin_id INTEGER REFERENCES administrators(id) ON DELETE CASCADE,
      expires_at BIGINT NOT NULL,
      created_at BIGINT NOT NULL,
      last_seen_at BIGINT NOT NULL,
      CHECK (
        (user_id IS NOT NULL AND admin_id IS NULL)
        OR (user_id IS NULL AND admin_id IS NOT NULL)
      )
    );

    CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS sessions_admin_id_idx ON sessions(admin_id);
    CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);
    CREATE INDEX IF NOT EXISTS recruiters_status_idx ON users(role, recruiter_status);

    CREATE TABLE IF NOT EXISTS email_challenges (
      email TEXT NOT NULL,
      purpose TEXT NOT NULL CHECK (purpose IN ('signup', 'password_reset')),
      code_hash TEXT NOT NULL,
      name TEXT,
      role TEXT,
      password_hash TEXT,
      password_salt TEXT,
      expires_at BIGINT NOT NULL,
      created_at BIGINT NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (email, purpose)
    );
    CREATE INDEX IF NOT EXISTS email_challenges_expiry_idx ON email_challenges(expires_at);

    CREATE TABLE IF NOT EXISTS capacity_guard (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      revision BIGINT NOT NULL DEFAULT 0
    );
    INSERT INTO capacity_guard (id, revision) VALUES (1, 0)
    ON CONFLICT (id) DO NOTHING;
  `);
}
