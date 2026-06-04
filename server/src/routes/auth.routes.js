const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const ApiResponse = require('../utils/apiResponse');

const validateRegister = (req, res, next) => {
  const errors = [];
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (!/^\S+@\S+\.\S+$/.test(email)) errors.push({ field: 'email', message: 'Valid email required' });
  if (password.length < 8) errors.push({ field: 'password', message: 'Min 8 characters' });
  if (!/[A-Z]/.test(password)) errors.push({ field: 'password', message: 'At least one uppercase letter' });
  if (!/[0-9]/.test(password)) errors.push({ field: 'password', message: 'At least one number' });

  if (errors.length) return ApiResponse.error(res, 'Validation failed', 400, errors);
  req.body.email = email;
  next();
};

const validateLogin = (req, res, next) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (!/^\S+@\S+\.\S+$/.test(email) || !password) {
    return ApiResponse.error(res, 'Validation failed', 400);
  }

  req.body.email = email;
  next();
};

router.post('/register', validateRegister, auth.register);
router.get('/verify-email', auth.verifyEmail);
router.post('/login', validateLogin, auth.login);
router.post('/refresh', auth.refreshToken);
router.post('/logout', protect, auth.logout);
router.get('/me', protect, auth.getMe);
router.post('/2fa/setup', protect, auth.setup2FA);
router.post('/2fa/enable', protect, auth.enable2FA);
router.post('/2fa/verify', auth.verify2FALogin);
router.post('/2fa/disable', protect, auth.disable2FA);

module.exports = router;
