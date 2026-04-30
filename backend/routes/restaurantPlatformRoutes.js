// Restaurant ↔ Platform mapping routes — mount path: /api/restaurant-platforms

const express = require('express');
const controller = require('../controllers/restaurantPlatformController');

const router = express.Router();

router.get('/', controller.listRestaurantPlatforms);

module.exports = router;
