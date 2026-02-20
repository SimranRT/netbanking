/**
 * Authentication Routes
 */
const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
