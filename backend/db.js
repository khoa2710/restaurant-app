/*
  PostgreSQL connection for the Express API.
  Uses the `pg` Pool
 
  Environment variables are loaded from `backend/.env`
 */

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD || undefined,
  port: Number(process.env.DB_PORT) || 5432,
  ...(process.env.DB_HOST === '/tmp' && {
    host: '/tmp',
    port: Number(process.env.DB_PORT) || 8888,
  }),
});

module.exports = pool;
