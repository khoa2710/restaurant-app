/**
 * User controller — request handling, validation, SQL queries, JSON.
 * Never returns password_hash to clients.
 */

const pool = require('../db');

/** GET /api/users — list users (no password_hash). */
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

module.exports = {
  listUsers,
};
