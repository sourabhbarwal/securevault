const AuditLog = require('../models/AuditLog.model');
const { emitToUser } = require('../config/socket');

const LOG_ALLOWLIST = new Set([
  'LOGIN', 'LOGIN_FAILED', 'LOGOUT', 'REGISTER', 'EMAIL_VERIFIED',
  'PASSWORD_CHANGED', 'TWO_FA_ENABLED', 'TWO_FA_DISABLED',
  'SECRET_CREATE', 'SECRET_DELETE',
  'APIKEY_CREATED', 'APIKEY_USED', 'APIKEY_REVOKED',
]);

const log = async (userId, action, req, metadata = {}, success = true) => {
  if (!LOG_ALLOWLIST.has(action)) return;

  try {
    const entry = await AuditLog.create({
      userId,
      action,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      metadata,
      success,
    });

    emitToUser(userId.toString(), 'audit:new', {
      _id: entry._id,
      action: entry.action,
      ipAddress: entry.ipAddress,
      success: entry.success,
      createdAt: entry.createdAt,
    });
  } catch (err) {
    console.error('Audit log failed (non-fatal):', err.message);
  }
};

module.exports = { log };
