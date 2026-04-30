/* Dashboard controller — aggregate counts and average review rating. */

const pool = require('../db');

/** GET /api/dashboard/stats — single object summary. */
async function getStats(req, res) {
  try {
    const sql = `
      SELECT
        (SELECT COUNT(*)::int FROM users) AS total_users,
        (SELECT COUNT(*)::int FROM restaurants) AS total_restaurants,
        (SELECT COUNT(*)::int FROM reservations) AS total_reservations,
        (SELECT COUNT(*)::int FROM reviews) AS total_reviews,
        (SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews) AS average_rating,
        (SELECT COUNT(*)::int FROM reservations WHERE status = 'confirmed') AS confirmed_reservations,
        (SELECT COUNT(*)::int FROM reservations WHERE status = 'cancelled') AS cancelled_reservations
    `;
    const { rows } = await pool.query(sql);
    res.json(rows[0]);
  } catch (err) {
    console.error('GET /api/dashboard/stats failed:', err);
    res.status(500).json({
      error: 'Failed to load dashboard statistics',
      message: err.message,
    });
  }
}

module.exports = {
  getStats,
};
