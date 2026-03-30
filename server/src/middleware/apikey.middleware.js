const bcrypt      = require('bcryptjs');
const ApiKey      = require('../models/ApiKey.model');
const ApiResponse = require('../utils/apiResponse');
const auditService = require('../services/audit.service');

const authenticateApiKey = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('ApiKey ')) return ApiResponse.error(res, 'Use: Authorization: ApiKey <key>', 401);

  const rawKey = authHeader.split(' ')[1];
  if (!rawKey?.startsWith('sv_live_')) return ApiResponse.error(res, 'Invalid key format', 401);

  try {
    const prefix = rawKey.substring(0, 16) + '...';
    const candidates = await ApiKey.find({ keyPrefix: prefix, isActive: true });

    let matched = null;
    for (const c of candidates) {
      if (await bcrypt.compare(rawKey, c.keyHash)) { matched = c; break; }
    }

    if (!matched) return ApiResponse.error(res, 'Invalid or revoked API key', 401);
    if (matched.isExpired()) return ApiResponse.error(res, 'API key expired', 401);

    req.userId = matched.userId.toString();
    req.apiKeyId = matched._id;
    req.apiKeyPermissions = matched.permissions;

    ApiKey.findByIdAndUpdate(matched._id, { lastUsedAt: new Date() }).exec();
    await auditService.log(matched.userId, 'APIKEY_USED', req, { keyId: matched._id, name: matched.name });
    next();
  } catch (err) { return ApiResponse.error(res, err.message); }
};

module.exports = { authenticateApiKey };