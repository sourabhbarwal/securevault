const express = require('express');
const router  = express.Router();
const apikey  = require('../controllers/apikey.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.post('/',      apikey.createApiKey);
router.get('/',       apikey.listApiKeys);
router.delete('/:id', apikey.revokeApiKey);

module.exports = router;