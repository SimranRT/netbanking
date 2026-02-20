/**
 * Server Entry Point
 * Starts the Express server
 */
require('dotenv').config();
const app = require('./app');
const initDatabase = require('./models/initDatabase');

const PORT = process.env.PORT || 5000;

// Start server first so API is reachable, then init DB in background
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
  // Initialize database tables (non-blocking)
  initDatabase()
    .then(() => console.log('✅ Database tables ready'))
    .catch(err => console.warn('⚠️ Database init failed (fix .env and restart):', err.message));
});
