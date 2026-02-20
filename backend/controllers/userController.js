/**
 * User Controller
 * Handles user-related operations
 */
const pool = require('../config/db');

/**
 * Get user balance
 * GET /balance
 * Protected route - requires authentication
 */
const getBalance = async (req, res) => {
  try {
    const username = req.user.username;

    // Fetch balance from database
    const [users] = await pool.execute(
      'SELECT balance FROM KodUser WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const balance = parseFloat(users[0].balance);

    res.json({
      success: true,
      message: 'Your balance is',
      balance: balance
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch balance',
      error: error.message
    });
  }
};

module.exports = {
  getBalance
};
