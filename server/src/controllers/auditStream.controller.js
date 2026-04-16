const { auditEmitter }          = require('../services/audit.service');
const { verifyAccessToken }     = require('../services/token.service');

/**
 * GET /api/audit/stream?token=<accessToken>
 * Server-Sent Events endpoint — streams new audit logs in real time.
 * EventSource cannot send custom headers, so token comes via query param.
 */
exports.streamAuditLogs = (req, res) => {
  // ── Authenticate via query param token ────────────────────
  const token = req.query.token;
  if (!token) {
    res.status(401).end('No token provided');
    return;
  }

  let userId;
  try {
    const decoded = verifyAccessToken(token);
    userId = decoded.userId.toString();
  } catch {
    res.status(401).end('Invalid or expired token');
    return;
  }

  // ── SSE headers ───────────────────────────────────────────
  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // disable nginx buffering if proxied
  res.flushHeaders();

  // Send a heartbeat every 30 s to keep the connection alive
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 30_000);

  // ── Listener ──────────────────────────────────────────────
  const onNewLog = (log) => {
    // Only emit to the matching user
    if (log.userId.toString() !== userId) return;
    res.write(`data: ${JSON.stringify(log)}\n\n`);
  };

  auditEmitter.on('newLog', onNewLog);

  // ── Clean up on disconnect ─────────────────────────────────
  req.on('close', () => {
    clearInterval(heartbeat);
    auditEmitter.off('newLog', onNewLog);
  });
};
