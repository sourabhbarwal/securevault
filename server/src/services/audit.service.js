const EventEmitter = require('events');
const AuditLog     = require('../models/AuditLog.model');

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