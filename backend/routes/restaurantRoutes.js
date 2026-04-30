/*
  Restaurants routes — mount path: /api/restaurants
 */

const express = require('express');
const controller = require('../controllers/restaurantController');

const router = express.Router();

router.get('/', controller.listRestaurants);
router.get('/:id', controller.getRestaurant);
router.get('/:id/reviews', controller.getRestaurantReviews);

module.exports = router;
