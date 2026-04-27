/**
 * Reviews routes — mount path: /api/reviews
 */

const express = require('express');
const controller = require('../controllers/reviewController');

const router = express.Router();

router.get('/', controller.listReviews);
router.post('/', controller.createReview);
router.put('/:id', controller.updateReview);
router.delete('/:id', controller.deleteReview);

module.exports = router;
