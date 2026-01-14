const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  req.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  console.log(`[${timestamp}] [${req.id}] ${req.method} ${req.path}`);
  next();
};

module.exports = logger;