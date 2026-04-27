/**
 * Reviews routes — mount path: /api/reviews
 *
 * Future routes (Phase 2):
 *   POST   /        create review (rating 1–5)
 *   PUT    /:id     update review
 *   DELETE /:id     remove review
 */

const express = require('express');
const controller = require('../controllers/reviewController');

const router = express.Router();

router.get('/', controller.listReviews);

module.exports = router;
