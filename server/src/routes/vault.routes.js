const express = require('express');
const router = express.Router();
const vault = require('../controllers/vault.controller');
const { protect } = require('../middleware/auth.middleware');
const { authenticateApiKey } = require('../middleware/apikey.middleware');
const ApiResponse = require('../utils/apiResponse');

const flexAuth = (req, res, next) => {
  if (req.headers.authorization?.startsWith('ApiKey ')) return authenticateApiKey(req, res, next);
  return protect(req, res, next);
};

const requireApiPermission = (permission) => (req, res, next) => {
  if (!req.apiKeyId) return next();

  if (!req.apiKeyPermissions?.includes(permission)) {
    return ApiResponse.error(res, `API key missing ${permission} permission`, 403);
  }

  next();
};

const validateSecretCreate = (req, res, next) => {
  const errors = [];
  const allowedCategories = new Set(['login', 'card', 'note', 'api_key']);

  if (!String(req.body.name || '').trim()) errors.push({ field: 'name', message: 'Name required' });
  if (req.body.category && !allowedCategories.has(req.body.category)) {
    errors.push({ field: 'category', message: 'Invalid category' });
  }
  if (!req.body.encryptedData) errors.push({ field: 'encryptedData', message: 'encryptedData required' });
  if (!req.body.iv) errors.push({ field: 'iv', message: 'iv required' });
  if (!req.body.authTag) errors.push({ field: 'authTag', message: 'authTag required' });

  if (errors.length) return ApiResponse.error(res, 'Validation failed', 400, errors);
  req.body.name = String(req.body.name).trim();
  next();
};

router.use(flexAuth);
router.get('/', requireApiPermission('read'), vault.listSecrets);
router.get('/:id', requireApiPermission('read'), vault.getSecret);
router.post('/', requireApiPermission('write'), validateSecretCreate, vault.createSecret);
router.put('/:id', requireApiPermission('write'), vault.updateSecret);
router.delete('/:id', requireApiPermission('delete'), vault.deleteSecret);

module.exports = router;
