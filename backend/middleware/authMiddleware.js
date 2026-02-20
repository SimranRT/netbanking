/**
 * Authentication Middleware
 * Verifies JWT token from HTTP-only cookie
 */
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

/**
 * Middleware to verify JWT token
 * Extracts token from cookie and validates it
 */
const verifyToken = async (req, res, next) => {
  try {
    // Get token from HTTP-only cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token exists in database and is not expired
    const [tokens] = await pool.execute(
      'SELECT * FROM UserToken WHERE token = ? AND expiry > NOW()',
      [token]
    );

    if (tokens.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token.' 
      });
    }

    // Attach user info to request object
    req.user = {
      username: decoded.sub,
      role: decoded.role,
      uid: decoded.uid
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired.' 
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication error.', 
      error: error.message 
    });
  }
};

module.exports = { verifyToken };
