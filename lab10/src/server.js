import dotenv from 'dotenv';

// Load environment variables FIRST - before any other imports
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚪 Gate of Moria server is running...`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⚡ Press Ctrl+C to stop\n`);
});