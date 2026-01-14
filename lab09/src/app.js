require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const { fail } = require('./utils/responses');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true
}));

// Logging middleware (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom logger
app.use(logger);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/v1/members', require('./routes/members.routes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json(fail('Route not found'));
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;