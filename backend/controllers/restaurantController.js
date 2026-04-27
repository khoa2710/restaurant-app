/**
 * Restaurant controller — request handling, validation, SQL queries, JSON.
 * Mounted under /api/restaurants by routes/restaurantRoutes.js.
 */

const pool = require('../db');

function parseId(idStr) {
  const id = Number(idStr);
  return Number.isInteger(id) && id > 0 ? id : null;
}

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

/** GET /api/restaurants/:id — single restaurant + average rating. */
async function getRestaurant(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid restaurant id' });
  }

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
        ROUND(AVG(rv.rating)::numeric, 2) AS average_rating,
        COUNT(rv.review_id)::int AS review_count
      FROM restaurants r
      LEFT JOIN reviews rv ON r.restaurant_id = rv.restaurant_id
      WHERE r.restaurant_id = $1
      GROUP BY r.restaurant_id
    `;
    const { rows } = await pool.query(sql, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('GET /api/restaurants/:id failed:', err);
    res.status(500).json({
      error: 'Failed to load restaurant',
      message: err.message,
    });
  }
}

/** GET /api/restaurants/:id/reviews — reviews for one restaurant. */
async function getRestaurantReviews(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid restaurant id' });
  }

  try {
    const exists = await pool.query(
      'SELECT 1 FROM restaurants WHERE restaurant_id = $1',
      [id]
    );
    if (exists.rowCount === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

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
      WHERE rev.restaurant_id = $1
      ORDER BY rev.review_date DESC, rev.review_id
    `;
    const { rows } = await pool.query(sql, [id]);
    res.json(rows);
  } catch (err) {
    console.error('GET /api/restaurants/:id/reviews failed:', err);
    res.status(500).json({
      error: 'Failed to load reviews for restaurant',
      message: err.message,
    });
  }
}

module.exports = {
  listRestaurants,
  getRestaurant,
  getRestaurantReviews,
};
