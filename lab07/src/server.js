// Server entry point - imports app and starts the server

require('dotenv').config();
const app = require('./app');

// Get PORT from environment with fallback
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 Fellowship Registry API Server Started!');
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  console.log('Available endpoints:');
  console.log(`  GET    /api/v1/members          - List all members`);
  console.log(`  GET    /api/v1/members/:id      - Get member by ID`);
  console.log(`  POST   /api/v1/members          - Create new member`);
  console.log(`  PUT    /api/v1/members/:id      - Update member`);
  console.log(`  DELETE /api/v1/members/:id      - Delete member`);
  console.log(`  GET    /health                  - Health check\n`);
});