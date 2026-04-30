// Users routes — mount path: /api/users

//POST does NOT accept a password field — see controllers/userController.js.

const express = require('express');
const controller = require('../controllers/userController');

const router = express.Router();

router.get('/', controller.listUsers);
router.post('/', controller.createUser);

module.exports = router;
