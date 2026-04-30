/*
  Reservation controller — request handling, validation, SQL queries, JSON.
  Mirrors schema CHECK constraints so callers get readable 400s instead of 500s.
 */

const pool = require('../db');

const ALLOWED_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

function parseId(idStr) {
  const id = Number(idStr);
  return Number.isInteger(id) && id > 0 ? id : null;
}

/* GET /api/reservations — reservations joined with users and restaurants. */
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

/* POST /api/reservations — create a reservation (reservation_id is auto). */
async function createReservation(req, res) {
  const {
    user_id,
    restaurant_id,
    reservation_date,
    reservation_time,
    party_size,
    status,
  } = req.body || {};

  if (!Number.isInteger(user_id) || user_id <= 0) {
    return res.status(400).json({ error: 'user_id must be a positive integer' });
  }
  if (!Number.isInteger(restaurant_id) || restaurant_id <= 0) {
    return res.status(400).json({ error: 'restaurant_id must be a positive integer' });
  }
  if (typeof reservation_date !== 'string' || reservation_date.trim() === '') {
    return res.status(400).json({ error: 'reservation_date is required (YYYY-MM-DD)' });
  }
  if (typeof reservation_time !== 'string' || reservation_time.trim() === '') {
    return res.status(400).json({ error: 'reservation_time is required (HH:MM)' });
  }
  if (!Number.isInteger(party_size) || party_size <= 0) {
    return res.status(400).json({ error: 'party_size must be greater than 0' });
  }
  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `status must be one of: ${ALLOWED_STATUSES.join(', ')}`,
    });
  }

  try {
    const sql = `
      INSERT INTO reservations
        (user_id, restaurant_id, reservation_date, reservation_time, party_size, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING reservation_id, user_id, restaurant_id, reservation_date,
                reservation_time, party_size, status, created_at
    `;
    const params = [
      user_id,
      restaurant_id,
      reservation_date,
      reservation_time,
      party_size,
      status,
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
    console.error('POST /api/reservations failed:', err);
    res.status(500).json({
      error: 'Failed to create reservation',
      message: err.message,
    });
  }
}

/* PUT /api/reservations/:id — update editable fields (full update). */
async function updateReservation(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid reservation id' });
  }

  const { reservation_date, reservation_time, party_size, status } = req.body || {};

  if (typeof reservation_date !== 'string' || reservation_date.trim() === '') {
    return res.status(400).json({ error: 'reservation_date is required (YYYY-MM-DD)' });
  }
  if (typeof reservation_time !== 'string' || reservation_time.trim() === '') {
    return res.status(400).json({ error: 'reservation_time is required (HH:MM)' });
  }
  if (!Number.isInteger(party_size) || party_size <= 0) {
    return res.status(400).json({ error: 'party_size must be greater than 0' });
  }
  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `status must be one of: ${ALLOWED_STATUSES.join(', ')}`,
    });
  }

  try {
    const sql = `
      UPDATE reservations
      SET reservation_date = $1,
          reservation_time = $2,
          party_size = $3,
          status = $4
      WHERE reservation_id = $5
      RETURNING reservation_id, user_id, restaurant_id, reservation_date,
                reservation_time, party_size, status, created_at
    `;
    const params = [reservation_date, reservation_time, party_size, status, id];
    const { rows, rowCount } = await pool.query(sql, params);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('PUT /api/reservations/:id failed:', err);
    res.status(500).json({
      error: 'Failed to update reservation',
      message: err.message,
    });
  }
}

/* PATCH /api/reservations/:id/cancel — set status='cancelled'. */
async function cancelReservation(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid reservation id' });
  }

  try {
    const sql = `
      UPDATE reservations
      SET status = 'cancelled'
      WHERE reservation_id = $1
      RETURNING reservation_id, user_id, restaurant_id, reservation_date,
                reservation_time, party_size, status, created_at
    `;
    const { rows, rowCount } = await pool.query(sql, [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('PATCH /api/reservations/:id/cancel failed:', err);
    res.status(500).json({
      error: 'Failed to cancel reservation',
      message: err.message,
    });
  }
}

/* DELETE /api/reservations/:id — remove a reservation. */
async function deleteReservation(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid reservation id' });
  }

  try {
    const { rowCount } = await pool.query(
      'DELETE FROM reservations WHERE reservation_id = $1',
      [id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json({ ok: true, deleted_reservation_id: id });
  } catch (err) {
    console.error('DELETE /api/reservations/:id failed:', err);
    res.status(500).json({
      error: 'Failed to delete reservation',
      message: err.message,
    });
  }
}

module.exports = {
  listReservations,
  createReservation,
  updateReservation,
  cancelReservation,
  deleteReservation,
};
