const { verifyAccessToken } = require('../services/token.service');
const ApiResponse = require('../utils/apiResponse');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return ApiResponse.error(res, 'No token. Please log in.', 401);
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'Session expired. Log in again.' : 'Invalid token';
    return ApiResponse.error(res, msg, 401);
  }
};

module.exports = { protect };