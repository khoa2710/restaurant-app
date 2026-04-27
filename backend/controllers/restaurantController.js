/**
 * Restaurant controller — request handling, validation, SQL queries, JSON.
 * Mounted under /api/restaurants by routes/restaurantRoutes.js.
 */

const pool = require('../db');

/** GET /api/restaurants — all restaurants with average review rating. */
async function listRestaurants(req, res) {
  try {
    const sql = `
      SELECT
        r.restaurant_id,
        r.name,
        r.address,
        r.city,
        r.cuisine_type,
        r.price_range,
        r.phone,
        r.hours,
        ROUND(AVG(rv.rating)::numeric, 2) AS average_rating
      FROM restaurants r
      LEFT JOIN reviews rv ON r.restaurant_id = rv.restaurant_id
      GROUP BY r.restaurant_id
      ORDER BY r.name
    `;
    const { rows } = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error('GET /api/restaurants failed:', err);
    res.status(500).json({
      error: 'Failed to load restaurants',
      message: err.message,
    });
  }
}

module.exports = {
  listRestaurants,
};
