/**
 * Express application entry point. Generally it will
 * 
 *  - load env, configure middleware (CORS, JSON body parsing)
 *  - mount feature routers from ./routes/*.Routes.js
 *  - expose health-check endpoints (GET / and GET /api/test-db)
 *  - register 404 + global error handler last
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const pool = require('./db');

const restaurantRoutes = require('./routes/restaurantRoutes');
const userRoutes = require('./routes/userRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const platformRoutes = require('./routes/platformRoutes');
const restaurantPlatformRoutes = require('./routes/restaurantPlatformRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

// Health & diagnostics

app.get('/', (req, res) => {
  res.json({
    ok: true,
    service: 'restaurant-app-api',
    message: 'Restaurant Booking and Review Platform backend',
    endpoints: {
      health: 'GET /',
      dbTest: 'GET /api/test-db',
      restaurants: 'GET /api/restaurants',
      users: 'GET /api/users',
      reservations: 'GET /api/reservations',
      reviews: 'GET /api/reviews',
      platforms: 'GET /api/platforms',
      restaurantPlatforms: 'GET /api/restaurant-platforms',
      dashboardStats: 'GET /api/dashboard/stats',
    },
  });
});

app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS server_time');
    res.json({
      ok: true,
      database: process.env.DB_NAME,
      serverTime: result.rows[0].server_time,
    });
  } catch (err) {
    console.error('Database connection test failed:', err.message);
    res.status(503).json({
      ok: false,
      error: 'Could not connect to PostgreSQL',
      detail: err.message,
    });
  }
});

// Feature routers
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/platforms', platformRoutes);
app.use('/api/restaurant-platforms', restaurantPlatformRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 for any unmatched route
app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'Not found' });
});

// Final safety net — must be last
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
