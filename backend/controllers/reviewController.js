/**
 * Review controller — request handling, validation, SQL queries, JSON.
 * Mirrors schema CHECK rating BETWEEN 1 AND 5.
 */

const pool = require('../db');

const MIN_RATING = 1;
const MAX_RATING = 5;

function parseId(idStr) {
  const id = Number(idStr);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function isValidRating(value) {
  return typeof value === 'number' && Number.isFinite(value)
    && value >= MIN_RATING && value <= MAX_RATING;
}

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

/** POST /api/reviews — create a review (review_id is auto). */
async function createReview(req, res) {
  const {
    user_id,
    restaurant_id,
    rating,
    comment,
    review_date,
    source_platform,
  } = req.body || {};

  if (!Number.isInteger(user_id) || user_id <= 0) {
    return res.status(400).json({ error: 'user_id must be a positive integer' });
  }
  if (!Number.isInteger(restaurant_id) || restaurant_id <= 0) {
    return res.status(400).json({ error: 'restaurant_id must be a positive integer' });
  }
  if (!isValidRating(rating)) {
    return res.status(400).json({
      error: `rating must be a number between ${MIN_RATING} and ${MAX_RATING}`,
    });
  }
  if (typeof review_date !== 'string' || review_date.trim() === '') {
    return res.status(400).json({ error: 'review_date is required (YYYY-MM-DD)' });
  }

  try {
    const sql = `
      INSERT INTO reviews
        (user_id, restaurant_id, rating, comment, review_date, source_platform)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING review_id, user_id, restaurant_id, rating, comment, review_date, source_platform
    `;
    const params = [
      user_id,
      restaurant_id,
      rating,
      comment || null,
      review_date,
      source_platform || null,
    ];
    const { rows } = await pool.query(sql, params);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23503') {
      return res.status(400).json({
        error: 'Invalid user_id or restaurant_id (foreign key)',
        message: err.detail || err.message,
      });
    }
    console.error('POST /api/reviews failed:', err);
    res.status(500).json({
      error: 'Failed to create review',
      message: err.message,
    });
  }
}

/** PUT /api/reviews/:id — update review fields (full update). */
async function updateReview(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid review id' });
  }

  const { rating, comment, review_date, source_platform } = req.body || {};

  if (!isValidRating(rating)) {
    return res.status(400).json({
      error: `rating must be a number between ${MIN_RATING} and ${MAX_RATING}`,
    });
  }
  if (typeof review_date !== 'string' || review_date.trim() === '') {
    return res.status(400).json({ error: 'review_date is required (YYYY-MM-DD)' });
  }

  try {
    const sql = `
      UPDATE reviews
      SET rating = $1,
          comment = $2,
          review_date = $3,
          source_platform = $4
      WHERE review_id = $5
      RETURNING review_id, user_id, restaurant_id, rating, comment, review_date, source_platform
    `;
    const params = [rating, comment || null, review_date, source_platform || null, id];
    const { rows, rowCount } = await pool.query(sql, params);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('PUT /api/reviews/:id failed:', err);
    res.status(500).json({
      error: 'Failed to update review',
      message: err.message,
    });
  }
}

/** DELETE /api/reviews/:id — remove a review. */
async function deleteReview(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid review id' });
  }

  try {
    const { rowCount } = await pool.query(
      'DELETE FROM reviews WHERE review_id = $1',
      [id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ ok: true, deleted_review_id: id });
  } catch (err) {
    console.error('DELETE /api/reviews/:id failed:', err);
    res.status(500).json({
      error: 'Failed to delete review',
      message: err.message,
    });
  }
}

module.exports = {
  listReviews,
  createReview,
  updateReview,
  deleteReview,
};
