const express      = require('express');
const router       = express.Router();
const audit        = require('../controllers/audit.controller');
const auditStream  = require('../controllers/auditStream.controller');
const { protect }  = require('../middleware/auth.middleware');

// SSE stream — MUST be before router.use(protect) because
// EventSource cannot send Authorization headers; controller handles its own auth
router.get('/stream', auditStream.streamAuditLogs);

// All other audit routes require standard Bearer-token auth
router.use(protect);
router.get('/', audit.getAuditLogs);

module.exports = router;