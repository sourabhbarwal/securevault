const crypto      = require('crypto');
const bcrypt      = require('bcryptjs');
const ApiKey      = require('../models/ApiKey.model');
const ApiResponse = require('../utils/apiResponse');
const auditService = require('../services/audit.service');

exports.createApiKey = async (req, res) => {
  const { name, permissions = ['read'], expiresInDays } = req.body;
  if (!name) return ApiResponse.error(res, 'Name required', 400);
  const valid = ['read','write','delete'];
  const invalid = permissions.filter(p => !valid.includes(p));
  if (invalid.length) return ApiResponse.error(res, `Invalid permissions: ${invalid.join(', ')}`, 400);

  try {
    const rawKey    = `sv_live_${crypto.randomBytes(32).toString('hex')}`;
    const keyPrefix = rawKey.substring(0, 16) + '...';
    const keyHash   = await bcrypt.hash(rawKey, 10);
    const expiresAt = expiresInDays ? new Date(Date.now() + expiresInDays * 86400000) : null;

    const apiKey = await ApiKey.create({ userId: req.userId, name, keyHash, keyPrefix, permissions, expiresAt });
    await auditService.log(req.userId, 'APIKEY_CREATED', req, { keyId: apiKey._id, name });

    return ApiResponse.success(res, {
      apiKey: { _id: apiKey._id, name, keyPrefix, permissions, expiresAt, rawKey },
      warning: '⚠️  Copy this key now — it will NEVER be shown again.',
    }, 'API key created.', 201);
  } catch (err) { return ApiResponse.error(res, err.message); }
};

exports.listApiKeys = async (req, res) => {
  try {
    const keys = await ApiKey.find({ userId: req.userId, isActive: true }).select('-keyHash').sort({ createdAt: -1 });
    return ApiResponse.success(res, { apiKeys: keys });
  } catch (err) { return ApiResponse.error(res, err.message); }
};

exports.revokeApiKey = async (req, res) => {
  try {
    const key = await ApiKey.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { isActive: false }, { new: true });
    if (!key) return ApiResponse.error(res, 'API key not found', 404);
    await auditService.log(req.userId, 'APIKEY_REVOKED', req, { keyId: req.params.id });
    return ApiResponse.success(res, null, 'API key revoked.');
  } catch (err) { return ApiResponse.error(res, err.message); }
};