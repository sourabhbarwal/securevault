const mongoose = require('mongoose');

const secretSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    required: true, index: true,
  },
  name:     { type: String, required: [true, 'Name required'], trim: true, maxlength: 100 },
  category: { type: String, enum: ['login', 'card', 'note', 'api_key'], default: 'login' },

  // These 3 fields are the AES-256-GCM encrypted blob
  // Server STORES them but can NEVER decrypt them — only the client can
  encryptedData: { type: String, required: true },  // base64 ciphertext
  iv:            { type: String, required: true },  // hex 96-bit IV
  authTag:       { type: String, required: true },  // hex 128-bit GCM tag

  isFavorite:    { type: Boolean, default: false },
  lastAccessedAt: { type: Date,  default: null },
}, { timestamps: true });

secretSchema.index({ userId: 1, category: 1 });
secretSchema.index({ userId: 1, name: 'text' });

module.exports = mongoose.models.Secret || mongoose.model('Secret', secretSchema);