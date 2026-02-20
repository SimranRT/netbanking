/**
 * User Routes
 * Protected routes requiring authentication
 */
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { getBalance } = require('../controllers/userController');

// Protected routes
router.get('/balance', verifyToken, getBalance);

module.exports = router;
