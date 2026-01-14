// App configuration - builds and configures Express app (no listen here)

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import middleware
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const { fail } = require('./utils/responses');

// Import routes
const membersRoutes = require('./routes/members.routes');

// Initialize app
const app = express();

// 1. Helmet - security headers
app.use(helmet());

// 2. CORS - cross-origin resource sharing
app.use(cors({
  origin: true,
  credentials: true
}));

// 3. Morgan - HTTP request logger (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// 4. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Custom logger
app.use(logger);

// Rate limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json(fail('Too many requests, please try again later.', null, {
      retryAfter: req.rateLimit.resetTime
    }));
  }
});

// Apply rate limiter to all API routes
app.use('/api/', apiLimiter);

// Mount routers at /api/v1
app.use('/api/v1/members', membersRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler - must be after all other routes
app.use((req, res) => {
  res.status(404).json(fail('Route not found', null, {
    path: req.path,
    method: req.method
  }));
});

// Centralized error handler - must be last
app.use(errorHandler);

module.exports = app;