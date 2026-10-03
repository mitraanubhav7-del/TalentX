import { createPasswordHash } from './auth.js';

export async function provisionAdmin(database, { name, email, password }, { updateExisting = false } = {}) {
  const normalizedName = typeof name === 'string' ? name.trim() : '';
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!normalizedName || !normalizedEmail || !password) {
    throw new Error('Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD before provisioning the administrator.');
  }
  if (normalizedName.length < 2 || normalizedName.length > 80 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
    password.length < 14 || password.length > 128) {
    throw new Error('Admin name, email, or password does not meet validation requirements. Use a password of 14 to 128 characters.');
  }

  const { rows: [user] } = await database.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
  if (user) throw new Error('The administrator email is already registered to a candidate or recruiter.');

  const { rows: [existingAdmin] } = await database.query(
    'SELECT id FROM administrators WHERE email = $1',
    [normalizedEmail],
  );
  if (existingAdmin && !updateExisting) return;

  const { hash, salt } = await createPasswordHash(password);
  if (updateExisting) {
    await database.query(`
      INSERT INTO administrators (name, email, password_hash, password_salt, created_at)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        password_hash = EXCLUDED.password_hash,
        password_salt = EXCLUDED.password_salt
    `, [normalizedName, normalizedEmail, hash, salt, Date.now()]);
  } else {
    await database.query(`
      INSERT INTO administrators (name, email, password_hash, password_salt, created_at)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
    `, [normalizedName, normalizedEmail, hash, salt, Date.now()]);
  }
}
