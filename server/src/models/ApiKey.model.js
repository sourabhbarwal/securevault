const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name:   { type: String, required: [true, 'Name required'], trim: true, maxlength: 60 },

  // Raw key is NEVER stored — only its bcrypt hash
  keyHash:   { type: String, required: true },
  keyPrefix: { type: String, required: true },  // shown to user for identification

  permissions: { type: [String], enum: ['read', 'write', 'delete'], default: ['read'] },
  isActive:    { type: Boolean, default: true },
  lastUsedAt:  { type: Date,   default: null },
  expiresAt:   { type: Date,   default: null },  // null = never expires
}, { timestamps: true });

apiKeySchema.methods.isExpired = function () {
  return this.expiresAt ? new Date() > this.expiresAt : false;
};

module.exports = mongoose.models.ApiKey || mongoose.model('ApiKey', apiKeySchema);