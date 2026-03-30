const express = require('express');
const { body } = require('express-validator');
const router  = express.Router();
const vault   = require('../controllers/vault.controller');
const { protect } = require('../middleware/auth.middleware');
const { authenticateApiKey } = require('../middleware/apikey.middleware');

// Accept either Bearer JWT or ApiKey header
const flexAuth = (req, res, next) => {
  if (req.headers.authorization?.startsWith('ApiKey ')) return authenticateApiKey(req, res, next);
  return protect(req, res, next);
};

const createRules = [
  body('name').notEmpty().withMessage('Name required').trim(),
  body('category').optional().isIn(['login','card','note','api_key']),
  body('encryptedData').notEmpty().withMessage('encryptedData required'),
  body('iv').notEmpty().withMessage('iv required'),
  body('authTag').notEmpty().withMessage('authTag required'),
];

router.use(flexAuth);
router.get('/',      vault.listSecrets);
router.get('/:id',   vault.getSecret);
router.post('/',     createRules, vault.createSecret);
router.put('/:id',   vault.updateSecret);
router.delete('/:id', vault.deleteSecret);

module.exports = router;