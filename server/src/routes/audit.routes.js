const express = require('express');
const router  = express.Router();
const audit   = require('../controllers/audit.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/', audit.getAuditLogs);

module.exports = router;