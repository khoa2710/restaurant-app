/**
 * Review controller — request handling, validation, SQL queries, JSON.
 */

const pool = require('../db');

/** GET /api/reviews — reviews joined with users and restaurants. */
async function listReviews(req, res) {
  try {
    const sql = `
      SELECT
        rev.review_id,
        rev.user_id,
        u.name AS user_name,
        rev.restaurant_id,
        rest.name AS restaurant_name,
        rev.rating,
        rev.comment,
        rev.review_date,
        rev.source_platform
      FROM reviews rev
      INNER JOIN users u ON rev.user_id = u.user_id
      INNER JOIN restaurants rest ON rev.restaurant_id = rest.restaurant_id
      ORDER BY rev.review_date DESC, rev.review_id
    `;
    const { rows } = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error('GET /api/reviews failed:', err);
    res.status(500).json({
      error: 'Failed to load reviews',
      message: err.message,
    });
  }
}

module.exports = {
  listReviews,
};
