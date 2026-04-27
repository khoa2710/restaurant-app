/**
 * PostgreSQL connection for the Express API.
 *
 * Uses the `pg` Pool (recommended for web servers). Import this module
 * in route files when you add queries, e.g.:
 *   const pool = require('./db');
 *   const { rows } = await pool.query('SELECT ...');
 *
 * Environment variables are loaded from `backend/.env` (see `.env.example`).
 * `server.js` calls `dotenv.config()` before requiring this module.
 */

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
});

module.exports = pool;
