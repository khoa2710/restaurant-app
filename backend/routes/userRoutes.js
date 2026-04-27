/**
 * Users routes — mount path: /api/users
 *
 * Future routes (Phase 2):
 *   POST   /        create user (no password handling — see spec)
 *   GET    /:id     user profile
 */

const express = require('express');
const controller = require('../controllers/userController');

const router = express.Router();

router.get('/', controller.listUsers);

module.exports = router;
