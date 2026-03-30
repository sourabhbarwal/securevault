const express = require('express');
const { body } = require('express-validator');
const router  = express.Router();
const auth    = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const registerRules = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Min 8 characters')
    .matches(/[A-Z]/).withMessage('At least one uppercase letter')
    .matches(/[0-9]/).withMessage('At least one number'),
];

const loginRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password required'),
];

router.post('/register',     registerRules, auth.register);
router.get('/verify-email',  auth.verifyEmail);
router.post('/login',        loginRules, auth.login);
router.post('/refresh',      auth.refreshToken);
router.post('/logout',       protect, auth.logout);
router.get('/me',            protect, auth.getMe);

module.exports = router;