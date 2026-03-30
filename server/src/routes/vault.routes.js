const express = require('express');
const { body } = require('express-validator');
const router  = express.Router();
const vault   = require('../controllers/vault.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);  // all vault routes require JWT

const createRules = [
  body('name').notEmpty().withMessage('Name required').trim(),
  body('category').optional().isIn(['login','card','note','api_key']),
  body('encryptedData').notEmpty().withMessage('encryptedData required'),
  body('iv').notEmpty().withMessage('iv required'),
  body('authTag').notEmpty().withMessage('authTag required'),
];

router.get('/',      vault.listSecrets);
router.get('/:id',   vault.getSecret);
router.post('/',     createRules, vault.createSecret);
router.put('/:id',   vault.updateSecret);
router.delete('/:id', vault.deleteSecret);

module.exports = router;