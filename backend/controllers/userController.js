/*
  User controller — request handling, validation, SQL queries, JSON.
  Never returns password_hash to clients.
 */

const pool = require('../db');

const PLACEHOLDER_PASSWORD_HASH = 'pending_password_setup';

/* GET /api/users — list users (no password_hash). */
async function listUsers(req, res) {
  try {
    const sql = `
      SELECT user_id, name, email, phone, created_at
      FROM users
      ORDER BY user_id
    `;
    const { rows } = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error('GET /api/users failed:', err);
    res.status(500).json({
      error: 'Failed to load users',
      message: err.message,
    });
  }
}

/* POST /api/users — create a user. No password field accepted. */
async function createUser(req, res) {
  const { name, email, phone } = req.body || {};

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'name is required' });
  }
  if (typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email is required' });
  }
  if (phone !== undefined && phone !== null && typeof phone !== 'string') {
    return res.status(400).json({ error: 'phone must be a string if provided' });
  }

  try {
    const sql = `
      INSERT INTO users (name, email, phone, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING user_id, name, email, phone, created_at
    `;
    const params = [name.trim(), email.trim(), phone || null, PLACEHOLDER_PASSWORD_HASH];
    const { rows } = await pool.query(sql, params);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({
        error: 'Email already exists',
        message: err.detail || err.message,
      });
    }
    console.error('POST /api/users failed:', err);
    res.status(500).json({
      error: 'Failed to create user',
      message: err.message,
    });
  }
}

module.exports = {
  listUsers,
  createUser,
};
