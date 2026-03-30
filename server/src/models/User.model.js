const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const crypto   = require('crypto');

const userSchema = new mongoose.Schema({
  email: {
    type: String, required: [true, 'Email required'],
    unique: true, lowercase: true, trim: true, index: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
  },
  passwordHash:  { type: String, required: true },

  // Sent to client after login for AES key derivation — server never uses this to decrypt
  encryptionSalt: { type: String, default: () => crypto.randomBytes(32).toString('hex') },

  twoFactorSecret:    { type: String, default: null },
  isTwoFactorEnabled: { type: Boolean, default: false },
  isEmailVerified:    { type: Boolean, default: false },

  emailVerificationToken:   { type: String, default: null },
  emailVerificationExpires: { type: Date,   default: null },

  passwordResetToken:   { type: String, default: null },
  passwordResetExpires: { type: Date,   default: null },

  // Array of hashed refresh tokens (one per device, max 5)
  refreshTokens: [{ type: String }],
}, { timestamps: true });

// Strip sensitive fields from all JSON responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.twoFactorSecret;
  delete obj.refreshTokens;
  delete obj.emailVerificationToken;
  delete obj.passwordResetToken;
  return obj;
};

userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);