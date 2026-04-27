/**
 * Restaurants routes — mount path: /api/restaurants
 *
 * Future routes (Phase 2):
 *   GET    /:id            single restaurant + average rating
 *   GET    /:id/reviews    reviews for a restaurant (joined with users)
 *   POST   /               create restaurant (admin)
 *   PATCH  /:id            update restaurant
 *   DELETE /:id            remove restaurant
 */

const express = require('express');
const controller = require('../controllers/restaurantController');

const router = express.Router();

router.get('/', controller.listRestaurants);

module.exports = router;
