const EventEmitter = require('events');
const AuditLog     = require('../models/AuditLog.model');

// ── Events worth storing long-term ────────────────────────────
// SECRET_READ and SECRET_UPDATE are omitted — they fire on every
// vault open/fav toggle and would hit the free-tier limit fast.
// All destructive, auth, and key-management events are kept.
const LOG_ALLOWLIST = new Set([
  'LOGIN', 'LOGIN_FAILED', 'LOGOUT', 'REGISTER', 'EMAIL_VERIFIED',
  'PASSWORD_CHANGED', 'TWO_FA_ENABLED', 'TWO_FA_DISABLED',
  'SECRET_CREATE', 'SECRET_DELETE',
  'APIKEY_CREATED', 'APIKEY_USED', 'APIKEY_REVOKED',
]);

// ── Global emitter — SSE controller subscribes to this ────────

const auditEmitter = new EventEmitter();
auditEmitter.setMaxListeners(200); // support many concurrent SSE connections

const log = async (userId, action, req, metadata = {}, success = true) => {
  try {
    const entry = await AuditLog.create({
      userId,
      action,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      metadata,
      success,
    });

    // Fire the event so any open SSE connection for this user receives it
    auditEmitter.emit('newLog', entry);
  } catch (err) {
    // Audit errors must NEVER crash the main request
    console.error('⚠️   Audit log failed (non-fatal):', err.message);
  }
};

module.exports = { log, auditEmitter };