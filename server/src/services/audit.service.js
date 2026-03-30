const AuditLog = require('../models/AuditLog.model');

const log = async (userId, action, req, metadata = {}, success = true) => {
  try {
    await AuditLog.create({
      userId,
      action,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      metadata,
      success,
    });
  } catch (err) {
    // Audit errors must NEVER crash the main request
    console.error('⚠️   Audit log failed (non-fatal):', err.message);
  }
};

module.exports = { log };