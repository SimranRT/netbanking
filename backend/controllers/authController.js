/**
 * Authentication Controller
 * Handles registration and login
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

/**
 * Register a new user
 * POST /register
 */
const register = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    // Validation
    if (!username || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if user already exists
    const [existingUser] = await pool.execute(
      'SELECT * FROM KodUser WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user (role defaults to 'customer', balance defaults to 100000)
    const [result] = await pool.execute(
      `INSERT INTO KodUser (username, email, password, phone, role, balance) 
       VALUES (?, ?, ?, ?, 'customer', 100000.00)`,
      [username, email, hashedPassword, phone]
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please login.',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

/**
 * Login user
 * POST /login
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find user by username
    const [users] = await pool.execute(
      'SELECT * FROM KodUser WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        sub: user.username,
        role: user.role,
        uid: user.uid
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Calculate expiry date (24 hours from now)
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24);

    // Save token to database
    await pool.execute(
      'INSERT INTO UserToken (token, uid, expiry) VALUES (?, ?, ?)',
      [token, user.uid, expiryDate]
    );

    // Set HTTP-only cookie (sameSite: 'none' + secure required for cross-origin, e.g. Vercel + Render)
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

/**
 * Logout user
 * POST /logout
 */
const logout = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (token) {
      // Delete token from database
      await pool.execute('DELETE FROM UserToken WHERE token = ?', [token]);
    }

    // Clear cookie
    res.clearCookie('token');
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  logout
};
