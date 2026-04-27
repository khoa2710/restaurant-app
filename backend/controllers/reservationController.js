/**
 * Reservation controller — request handling, validation, SQL queries, JSON.
 */

const pool = require('../db');

/** GET /api/reservations — reservations joined with users and restaurants. */
async function listReservations(req, res) {
  try {
    const sql = `
      SELECT
        res.reservation_id,
        res.user_id,
        u.name AS user_name,
        res.restaurant_id,
        rest.name AS restaurant_name,
        res.reservation_date,
        res.reservation_time,
        res.party_size,
        res.status,
        res.created_at
      FROM reservations res
      INNER JOIN users u ON res.user_id = u.user_id
      INNER JOIN restaurants rest ON res.restaurant_id = rest.restaurant_id
      ORDER BY res.reservation_date DESC, res.reservation_time DESC
    `;
    const { rows } = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error('GET /api/reservations failed:', err);
    res.status(500).json({
      error: 'Failed to load reservations',
      message: err.message,
    });
  }
}

module.exports = {
  listReservations,
};
