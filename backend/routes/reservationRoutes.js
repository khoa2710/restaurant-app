// Reservations routes — mount path: /api/reservations

const express = require('express');
const controller = require('../controllers/reservationController');

const router = express.Router();

router.get('/', controller.listReservations);
router.post('/', controller.createReservation);
router.put('/:id', controller.updateReservation);
router.patch('/:id/cancel', controller.cancelReservation);
router.delete('/:id', controller.deleteReservation);

module.exports = router;
