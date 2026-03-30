const jwt    = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const generateAccessToken  = (userId) =>
  jwt.sign({ userId: userId.toString() }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES });

const generateRefreshToken = () => crypto.randomBytes(64).toString('hex');

const hashRefreshToken     = (token) => bcrypt.hash(token, 10);

const compareRefreshToken  = (raw, hashed) => bcrypt.compare(raw, hashed);

const verifyAccessToken    = (token) => jwt.verify(token, process.env.JWT_ACCESS_SECRET);

const generateEmailToken   = () => crypto.randomBytes(32).toString('hex');

module.exports = {
  generateAccessToken, generateRefreshToken,
  hashRefreshToken, compareRefreshToken,
  verifyAccessToken, generateEmailToken,
};