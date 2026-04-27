/**
 * Reservations routes — mount path: /api/reservations
 *
 * Future routes (Phase 2):
 *   POST   /              create reservation (omit reservation_id)
 *   PUT    /:id           update fields
 *   PATCH  /:id/cancel    set status='cancelled'
 *   DELETE /:id           remove reservation
 */

const express = require('express');
const controller = require('../controllers/reservationController');

const router = express.Router();

router.get('/', controller.listReservations);

module.exports = router;
