const Secret      = require('../models/Secret.model');
const ApiResponse = require('../utils/apiResponse');
const auditService = require('../services/audit.service');
const { validationResult } = require('express-validator');

// GET /api/vault — list metadata only (no encrypted blobs)
exports.listSecrets = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 50 } = req.query;
    const query = { userId: req.userId };
    if (category && ['login','card','note','api_key'].includes(category)) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const secrets = await Secret.find(query)
      .select('name category isFavorite lastAccessedAt createdAt updatedAt')
      .sort({ isFavorite: -1, updatedAt: -1 })
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Secret.countDocuments(query);
    return ApiResponse.success(res, { secrets, total, page: Number(page) });
  } catch (err) { return ApiResponse.error(res, err.message); }
};

// GET /api/vault/:id — get one secret WITH encrypted blob
exports.getSecret = async (req, res) => {
  try {
    const secret = await Secret.findOne({ _id: req.params.id, userId: req.userId });
    if (!secret) return ApiResponse.error(res, 'Secret not found', 404);

    secret.lastAccessedAt = new Date();
    await secret.save();
    await auditService.log(req.userId, 'SECRET_READ', req, { secretId: secret._id, name: secret.name });
    return ApiResponse.success(res, { secret });
  } catch (err) { return ApiResponse.error(res, err.message); }
};

// POST /api/vault — store new encrypted secret
exports.createSecret = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return ApiResponse.error(res, 'Validation failed', 400, errors.array());

  const { name, category, encryptedData, iv, authTag } = req.body;
  try {
    const secret = await Secret.create({ userId: req.userId, name, category: category || 'login', encryptedData, iv, authTag });
    await auditService.log(req.userId, 'SECRET_CREATE', req, { secretId: secret._id, name });
    return ApiResponse.success(res, { secret: { _id: secret._id, name: secret.name, category: secret.category } }, 'Secret stored.', 201);
  } catch (err) { return ApiResponse.error(res, err.message); }
};

// PUT /api/vault/:id — update secret
exports.updateSecret = async (req, res) => {
  const { name, encryptedData, iv, authTag, isFavorite } = req.body;
  try {
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (encryptedData !== undefined) updates.encryptedData = encryptedData;
    if (iv !== undefined) updates.iv = iv;
    if (authTag !== undefined) updates.authTag = authTag;
    if (isFavorite !== undefined) updates.isFavorite = isFavorite;

    const secret = await Secret.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, updates, { new: true, runValidators: true });
    if (!secret) return ApiResponse.error(res, 'Secret not found', 404);
    await auditService.log(req.userId, 'SECRET_UPDATE', req, { secretId: secret._id });
    return ApiResponse.success(res, { secret: { _id: secret._id, name: secret.name, updatedAt: secret.updatedAt } }, 'Secret updated.');
  } catch (err) { return ApiResponse.error(res, err.message); }
};

// DELETE /api/vault/:id
exports.deleteSecret = async (req, res) => {
  try {
    const secret = await Secret.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!secret) return ApiResponse.error(res, 'Secret not found', 404);
    await auditService.log(req.userId, 'SECRET_DELETE', req, { secretId: req.params.id, name: secret.name });
    return ApiResponse.success(res, null, 'Secret deleted.');
  } catch (err) { return ApiResponse.error(res, err.message); }
};