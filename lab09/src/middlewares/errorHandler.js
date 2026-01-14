const { fail } = require('../utils/responses');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json(fail('Validation failed', details));
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json(fail(`${field} already exists`));
  }

  // Mongoose cast error (invalid ID)
  if (err.name === 'CastError') {
    return res.status(400).json(fail('Invalid ID format'));
  }

  // Default server error
  const isDev = process.env.NODE_ENV !== 'production';
  res.status(err.status || 500).json(
    fail(
      err.message || 'Internal server error',
      isDev ? err.stack : null
    )
  );
};

module.exports = errorHandler;