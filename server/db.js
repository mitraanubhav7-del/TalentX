import 'dotenv/config';
import pg from 'pg';
import { DataType, newDb } from 'pg-mem';

const { Pool } = pg;

function createMemoryDatabasePool() {
  const memory = newDb();
  memory.public.registerFunction({
    name: 'char_length',
    args: [DataType.text],
    returns: DataType.integer,
    implementation: value => (value == null ? 0 : String(value).length),
  });
  const MemPool = memory.adapters.createPg().Pool;
  return new MemPool();
}

function createDatabasePool() {
  if (process.env.DATABASE_URL) {
    return new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
      max: Number(process.env.DB_POOL_SIZE || 5),
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('DATABASE_URL is required in production; refusing to use an in-memory database that would lose accounts and recruiter requests on restart.');
  }
  return createMemoryDatabasePool();
}

export const db = createDatabasePool();

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

    CREATE TABLE IF NOT EXISTS member_connections (
      id SERIAL PRIMARY KEY,
      left_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      right_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      requester_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'declined')),
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL,
      CHECK (left_user_id < right_user_id),
      CHECK (requester_id = left_user_id OR requester_id = right_user_id),
      UNIQUE (left_user_id, right_user_id)
    );
    CREATE INDEX IF NOT EXISTS member_connections_right_status_idx ON member_connections(right_user_id, status);
    CREATE INDEX IF NOT EXISTS member_connections_left_status_idx ON member_connections(left_user_id, status);

    CREATE TABLE IF NOT EXISTS direct_messages (
      id BIGSERIAL PRIMARY KEY,
      connection_id INTEGER NOT NULL REFERENCES member_connections(id) ON DELETE CASCADE,
      sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 4000),
      created_at BIGINT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS direct_messages_connection_created_idx ON direct_messages(connection_id, created_at, id);

    CREATE TABLE IF NOT EXISTS feed_posts (
      id BIGSERIAL PRIMARY KEY,
      author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
      created_at BIGINT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS feed_posts_created_idx ON feed_posts(created_at DESC, id DESC);
    CREATE TABLE IF NOT EXISTS feed_post_likes (
      post_id BIGINT NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at BIGINT NOT NULL,
      PRIMARY KEY (post_id, user_id)
    );

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
