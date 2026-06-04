const jwt    = require('jsonwebtoken');
const crypto = require('crypto');

const generateAccessToken  = (userId) =>
  jwt.sign({ userId: userId.toString() }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES });

const generate2FAChallengeToken = (userId) =>
  jwt.sign(
    { userId: userId.toString(), purpose: '2fa' },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '5m' }
  );

const generateRefreshToken = () => crypto.randomBytes(64).toString('hex');

const hashRefreshTokenForLookup = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const verifyAccessToken    = (token) => jwt.verify(token, process.env.JWT_ACCESS_SECRET);

const verify2FAChallengeToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  if (decoded.purpose !== '2fa') throw new Error('Invalid challenge token');
  return decoded;
};

const generateEmailToken   = () => crypto.randomBytes(32).toString('hex');

module.exports = {
  generateAccessToken, generate2FAChallengeToken, generateRefreshToken,
  hashRefreshTokenForLookup,
  verifyAccessToken, verify2FAChallengeToken, generateEmailToken,
};
