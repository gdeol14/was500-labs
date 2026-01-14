require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');

const authRoutes = require('./routes/auth');
const npcRoutes = require('./routes/npcs');
const questRoutes = require('./routes/quests');

const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser requests (like Postman)

    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://10.0.0.130:5173', 
      'http://10.0.0.138:5173'
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Dungeon Master Toolkit API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/npcs', npcRoutes);
app.use('/api/quests', questRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});