import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import middleware
import { logger } from './middlewares/logger.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

// Import routes
import moriaRoutes from './routes/moria.routes.js';

// Load environment variables
dotenv.config();

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors());

// Logging
app.use(morgan('dev'));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom logger
app.use(logger);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/v1/moria', moriaRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;