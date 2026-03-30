const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  action: {
    type: String, required: true,
    enum: [
      'LOGIN', 'LOGIN_FAILED', 'LOGOUT', 'REGISTER', 'EMAIL_VERIFIED',
      'PASSWORD_CHANGED', 'TWO_FA_ENABLED', 'TWO_FA_DISABLED',
      'SECRET_READ', 'SECRET_CREATE', 'SECRET_UPDATE', 'SECRET_DELETE',
      'APIKEY_CREATED', 'APIKEY_USED', 'APIKEY_REVOKED',
    ],
  },
  ipAddress: { type: String, default: 'unknown' },
  userAgent: { type: String, default: 'unknown' },
  metadata:  { type: mongoose.Schema.Types.Mixed, default: {} },
  success:   { type: Boolean, default: true },
}, { timestamps: true });

// Auto-delete logs older than 90 days
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });
auditLogSchema.index({ userId: 1, action: 1 });

module.exports = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);