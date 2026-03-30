const rateLimit = require('express-rate-limit');
const slowDown  = require('express-slow-down');

// Auth routes — strict (prevent brute force)
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 10, skipSuccessfulRequests: true,
  standardHeaders: true, legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Try again in 15 minutes.' },
});

// Slow down after 5 failed attempts
exports.authSlowDown = slowDown({
  windowMs: 15 * 60 * 1000, delayAfter: 5,
  delayMs: (used) => (used - 5) * 500,
});

// General API rate limit
exports.apiLimiter = rateLimit({
  windowMs: 60 * 1000, max: 100,
  message: { success: false, message: 'Rate limit exceeded.' },
});

// Vault reads — prevent bulk scraping
exports.vaultReadLimiter = rateLimit({
  windowMs: 60 * 1000, max: 60,
  message: { success: false, message: 'Too many reads. Wait a minute.' },
});