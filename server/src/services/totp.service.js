const speakeasy = require('speakeasy');
const qrcode    = require('qrcode');

const generateTOTPSecret = (userEmail) => {
  const s = speakeasy.generateSecret({ name: `SecureVault (${userEmail})`, issuer: 'SecureVault', length: 32 });
  return { base32: s.base32, otpauthUrl: s.otpauth_url };
};

const generateQRCodeDataURL = (otpauthUrl) =>
  qrcode.toDataURL(otpauthUrl, { width: 256, margin: 2, color: { dark: '#7EFFF5', light: '#04060F' } });

const verifyTOTPToken = (base32Secret, token) =>
  speakeasy.totp.verify({ secret: base32Secret, encoding: 'base32', token, window: 1 });

module.exports = { generateTOTPSecret, generateQRCodeDataURL, verifyTOTPToken };