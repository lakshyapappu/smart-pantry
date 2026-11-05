const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const pantryRoutes = require('./routes/pantryRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const groceryRoutes = require('./routes/groceryRoutes');
const postRoutes = require('./routes/postRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://localhost:5000',
  process.env.CLIENT_URL
].filter(Boolean);

// CORS configuration: Allow localhost with credentials
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. mobile apps, curl, or same-origin in production)
      if (!origin) return callback(null, true);

      // Check explicit allowed origins or any localhost/127.0.0.1 port in development
      const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      if (allowedOrigins.indexOf(origin) !== -1 || isLocalhost || process.env.NODE_ENV === 'production') {
        callback(null, origin);
      } else {
        callback(null, origin);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Request logging middleware (without exposing passwords or tokens)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.originalUrl.startsWith('/api')) {
      const statusColor = res.statusCode >= 500 ? '❌' : res.statusCode >= 400 ? '⚠️' : '✅';
      console.log(`[API] ${statusColor} ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const dbStatus = dbStates[mongoose.connection.readyState] || 'unknown';

  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus,
      connected: mongoose.connection.readyState === 1
    }
  });
});

// Database readiness check middleware for API endpoints
app.use('/api', (req, res, next) => {
  // Allow health check to pass without DB
  if (req.path === '/health') return next();

  // If DB is disconnected (readyState 0), return clean 503 instead of buffering and timing out
  if (mongoose.connection.readyState === 0) {
    return res.status(503).json({
      success: false,
      message: 'Database is currently offline or connecting. Please check database configuration.'
    });
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pantry', pantryRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/grocery', groceryRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Explicit 404 for unknown /api/* routes (ensures API errors never return index.html)
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// Production: Serve React client build from client/dist
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (process.env.NODE_ENV === 'production' || fs.existsSync(clientDistPath)) {
  // Serve static assets (JS, CSS, images, icons)
  app.use(express.static(clientDistPath));

  // SPA Fallback: Direct refreshes and deep routes (/pantry, /recipes, etc.) serve index.html
  app.get('*', (req, res) => {
    const indexPath = path.join(clientDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Application frontend build not found. Please build the client first.');
    }
  });
} else {
  // Helpful root route in pure backend dev mode
  app.get('/', (req, res) => {
    res.json({
      message: 'Smart Pantry & Zero-Waste Recipe Generator API',
      health: '/api/health',
      environment: process.env.NODE_ENV || 'development'
    });
  });
}

// Centralized error handling
app.use(errorHandler);

module.exports = app;
