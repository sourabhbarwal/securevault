const AuditLog    = require('../models/AuditLog.model');
const ApiResponse = require('../utils/apiResponse');

exports.getAuditLogs = async (req, res) => {
  try {
    const { action, page = 1, limit = 30 } = req.query;
    const query = { userId: req.userId };
    if (action) query.action = action;
    const logs  = await AuditLog.find(query).sort({ createdAt: -1 }).skip((page-1)*limit).limit(Number(limit));
    const total = await AuditLog.countDocuments(query);
    return ApiResponse.success(res, { logs, total, page: Number(page) });
  } catch (err) { return ApiResponse.error(res, err.message); }
};
