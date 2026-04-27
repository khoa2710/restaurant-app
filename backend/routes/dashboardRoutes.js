/**
 * Dashboard routes — mount path: /api/dashboard
 */

const express = require('express');
const controller = require('../controllers/dashboardController');

const router = express.Router();

router.get('/stats', controller.getStats);

module.exports = router;
