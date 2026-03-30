const ApiResponse = require('../utils/apiResponse');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error('🔴  Unhandled Error:', err.message);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return ApiResponse.error(res, 'Validation failed', 422, errors);
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return ApiResponse.error(res, `${field} already exists`, 409);
  }
  if (err.name === 'JsonWebTokenError') return ApiResponse.error(res, 'Invalid token', 401);
  if (err.name === 'TokenExpiredError') return ApiResponse.error(res, 'Token expired', 401);

  return ApiResponse.error(res, err.message || 'Internal Server Error', err.statusCode || 500);
};

module.exports = errorHandler;