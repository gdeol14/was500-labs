// Centralized error handling middleware

const { fail } = require('../utils/responses');

const errorHandler = (err, req, res, next) => {
  // Log full error details to console (for debugging)
  console.error('Error occurred:', {
    message: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : 'Stack trace hidden in production',
    requestId: req.id,
    path: req.path,
    method: req.method
  });

  // Determine status code
  const statusCode = err.statusCode || 500;
  
  // Prepare error message
  const message = err.message || 'Internal Server Error';
  
  // In production, mask internal errors
  const safeMessage = process.env.NODE_ENV === 'production' && statusCode === 500 
    ? 'Internal Server Error' 
    : message;

  // Send response using standard shape
  res.status(statusCode).json(fail(safeMessage, err.details || null, { requestId: req.id }));
};

module.exports = errorHandler;