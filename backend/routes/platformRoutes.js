/*
  Platforms routes — mount path: /api/platforms
  Future routes (Phase 2): GET /api/restaurant-platforms (mounted separately).
 */

const express = require('express');
const controller = require('../controllers/platformController');

const router = express.Router();

router.get('/', controller.listPlatforms);

module.exports = router;
