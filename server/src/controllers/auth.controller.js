const bcrypt      = require('bcryptjs');
const User        = require('../models/User.model');
const ApiResponse = require('../utils/apiResponse');
const tokenService = require('../services/token.service');
const emailService = require('../services/email.service');
const auditService = require('../services/audit.service');
const { validationResult } = require('express-validator');

// ── Helper: set refresh token as HttpOnly cookie ──────────
const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// ── Helper: find user by raw refresh token ────────────────
const findUserByRefreshToken = async (rawToken) => {
  const users = await User.find({ refreshTokens: { $not: { $size: 0 } } });
  for (const user of users) {
    for (const hashed of user.refreshTokens) {
      if (await tokenService.compareRefreshToken(rawToken, hashed)) return user;
    }
  }
  return null;
};

// ══════════════════════════════════════════════════════════
// REGISTER — POST /api/auth/register
// ══════════════════════════════════════════════════════════
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return ApiResponse.error(res, 'Validation failed', 400, errors.array());

  const { email, password } = req.body;
  try {
    if (await User.findOne({ email })) return ApiResponse.error(res, 'Email already registered', 409);

    const passwordHash = await bcrypt.hash(password, 12);
    const emailVerificationToken   = tokenService.generateEmailToken();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({ email, passwordHash, emailVerificationToken, emailVerificationExpires });

    try { await emailService.sendVerificationEmail(user, emailVerificationToken); }
    catch (e) { console.error('⚠️  Email send failed:', e.message); }

    await auditService.log(user._id, 'REGISTER', req);
    return ApiResponse.success(res, { userId: user._id, email: user.email }, 'Account created. Verify your email.', 201);
  } catch (err) { return ApiResponse.error(res, err.message); }
};

// ══════════════════════════════════════════════════════════
// VERIFY EMAIL — GET /api/auth/verify-email?token=xxx
// ══════════════════════════════════════════════════════════
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;
  if (!token) return ApiResponse.error(res, 'Token required', 400);
  try {
    const user = await User.findOne({ emailVerificationToken: token, emailVerificationExpires: { $gt: new Date() } });
    if (!user) return ApiResponse.error(res, 'Invalid or expired link', 400);
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();
    await auditService.log(user._id, 'EMAIL_VERIFIED', req);
    return ApiResponse.success(res, null, 'Email verified!');
  } catch (err) { return ApiResponse.error(res, err.message); }
};

// ══════════════════════════════════════════════════════════
// LOGIN — POST /api/auth/login
// ══════════════════════════════════════════════════════════
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return ApiResponse.error(res, 'Validation failed', 400, errors.array());

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    // Same error message for wrong email AND wrong password — prevents enumeration
    if (!user || !(await user.comparePassword(password))) {
      await auditService.log(user?._id || '000000000000000000000000', 'LOGIN_FAILED', req, { email }, false);
      return ApiResponse.error(res, 'Invalid email or password', 401);
    }

    // If 2FA enabled → don't issue tokens yet, ask client to send TOTP code
    if (user.isTwoFactorEnabled) {
      return ApiResponse.success(res, { requires2FA: true, userId: user._id }, '2FA code required');
    }

    const accessToken  = tokenService.generateAccessToken(user._id);
    const refreshToken = tokenService.generateRefreshToken();
    const hashedRefresh = await tokenService.hashRefreshToken(refreshToken);
    user.refreshTokens.push(hashedRefresh);
    if (user.refreshTokens.length > 5) user.refreshTokens = user.refreshTokens.slice(-5);
    await user.save();

    setRefreshCookie(res, refreshToken);
    await auditService.log(user._id, 'LOGIN', req);

    return ApiResponse.success(res, {
      accessToken,
      user: user.toJSON(),
      encryptionSalt: user.encryptionSalt,  // client needs this for AES key derivation
    }, 'Login successful');
  } catch (err) { return ApiResponse.error(res, err.message); }
};

// ══════════════════════════════════════════════════════════
// REFRESH TOKEN — POST /api/auth/refresh
// ══════════════════════════════════════════════════════════
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return ApiResponse.error(res, 'No refresh token', 401);
  try {
    const user = await findUserByRefreshToken(refreshToken);
    if (!user) {
      res.clearCookie('refreshToken');
      return ApiResponse.error(res, 'Invalid refresh token', 403);
    }
    return ApiResponse.success(res, { accessToken: tokenService.generateAccessToken(user._id) }, 'Token refreshed');
  } catch (err) { return ApiResponse.error(res, err.message); }
};

// ══════════════════════════════════════════════════════════
// LOGOUT — POST /api/auth/logout
// ══════════════════════════════════════════════════════════
exports.logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  try {
    if (refreshToken && req.userId) {
      const user = await User.findById(req.userId);
      if (user) {
        const updated = [];
        for (const h of user.refreshTokens) {
          if (!(await tokenService.compareRefreshToken(refreshToken, h))) updated.push(h);
        }
        user.refreshTokens = updated;
        await user.save();
      }
    }
    res.clearCookie('refreshToken');
    await auditService.log(req.userId, 'LOGOUT', req);
    return ApiResponse.success(res, null, 'Logged out');
  } catch (err) { return ApiResponse.error(res, err.message); }
};

// ══════════════════════════════════════════════════════════
// GET ME — GET /api/auth/me
// ══════════════════════════════════════════════════════════
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return ApiResponse.error(res, 'User not found', 404);
    return ApiResponse.success(res, { user: user.toJSON() });
  } catch (err) { return ApiResponse.error(res, err.message); }
};

const totpService = require('../services/totp.service');

// ══════════════════════════════════════════════════════════
// SETUP 2FA — POST /api/auth/2fa/setup
// Returns QR code for Google Authenticator
// ══════════════════════════════════════════════════════════
exports.setup2FA = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return ApiResponse.error(res, 'User not found', 404);
    if (user.isTwoFactorEnabled) return ApiResponse.error(res, '2FA already enabled', 400);

    const { base32, otpauthUrl } = totpService.generateTOTPSecret(user.email);
    const qrCode = await totpService.generateQRCodeDataURL(otpauthUrl);

    user.twoFactorSecret = base32;
    await user.save();

    return ApiResponse.success(res, { qrCode, manualKey: base32 }, 'Scan QR in Google Authenticator, then call /2fa/enable with a code.');
  } catch (err) { return ApiResponse.error(res, err.message); }
};

// ══════════════════════════════════════════════════════════
// ENABLE 2FA — POST /api/auth/2fa/enable
// Body: { totpToken }
// ══════════════════════════════════════════════════════════
exports.enable2FA = async (req, res) => {
  const { totpToken } = req.body;
  if (!totpToken) return ApiResponse.error(res, 'TOTP code required', 400);
  try {
    const user = await User.findById(req.userId);
    if (!user?.twoFactorSecret) return ApiResponse.error(res, 'Run /2fa/setup first', 400);

    if (!totpService.verifyTOTPToken(user.twoFactorSecret, totpToken))
      return ApiResponse.error(res, 'Invalid code. Check your phone clock.', 401);

    user.isTwoFactorEnabled = true;
    await user.save();
    await auditService.log(user._id, 'TWO_FA_ENABLED', req);
    return ApiResponse.success(res, null, '2FA enabled. Required on next login.');
  } catch (err) { return ApiResponse.error(res, err.message); }
};

// ══════════════════════════════════════════════════════════
// VERIFY 2FA LOGIN — POST /api/auth/2fa/verify
// Called after password login when 2FA is enabled
// Body: { userId, totpToken }   ← no JWT needed yet
// ══════════════════════════════════════════════════════════
exports.verify2FALogin = async (req, res) => {
  const { userId, totpToken } = req.body;
  if (!userId || !totpToken) return ApiResponse.error(res, 'userId and totpToken required', 400);
  try {
    const user = await User.findById(userId);
    if (!user?.isTwoFactorEnabled) return ApiResponse.error(res, 'Invalid request', 400);

    if (!totpService.verifyTOTPToken(user.twoFactorSecret, totpToken)) {
      await auditService.log(user._id, 'LOGIN_FAILED', req, { reason: '2FA_INVALID' }, false);
      return ApiResponse.error(res, 'Invalid 2FA code', 401);
    }

    const accessToken   = tokenService.generateAccessToken(user._id);
    const refreshToken  = tokenService.generateRefreshToken();
    const hashedRefresh = await tokenService.hashRefreshToken(refreshToken);
    user.refreshTokens.push(hashedRefresh);
    if (user.refreshTokens.length > 5) user.refreshTokens = user.refreshTokens.slice(-5);
    await user.save();

    setRefreshCookie(res, refreshToken);
    await auditService.log(user._id, 'LOGIN', req);
    return ApiResponse.success(res, { accessToken, user: user.toJSON(), encryptionSalt: user.encryptionSalt }, '2FA verified. Login successful.');
  } catch (err) { return ApiResponse.error(res, err.message); }
};

// ══════════════════════════════════════════════════════════
// DISABLE 2FA — POST /api/auth/2fa/disable
// Body: { totpToken }  ← must confirm with current code to disable
// ══════════════════════════════════════════════════════════
exports.disable2FA = async (req, res) => {
  const { totpToken } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user?.isTwoFactorEnabled) return ApiResponse.error(res, '2FA not enabled', 400);
    if (!totpService.verifyTOTPToken(user.twoFactorSecret, totpToken))
      return ApiResponse.error(res, 'Invalid TOTP code', 401);
    user.isTwoFactorEnabled = false;
    user.twoFactorSecret = null;
    await user.save();
    await auditService.log(user._id, 'TWO_FA_DISABLED', req);
    return ApiResponse.success(res, null, '2FA disabled.');
  } catch (err) { return ApiResponse.error(res, err.message); }
};