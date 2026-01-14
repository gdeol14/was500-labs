// Custom logger middleware - attaches request ID and logs incoming requests

const logger = (req, res, next) => {
  // Attach unique request ID (timestamp + random)
  req.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Log request details
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} | Request ID: ${req.id}`);
  
  next();
};

module.exports = logger;