const AuditLog    = require('../models/AuditLog.model');
const ApiResponse = require('../utils/apiResponse');

exports.getAuditLogs = async (req, res) => {
  try {
    const { action, success, page = 1, limit = 25 } = req.query;
    const query = { userId: req.userId };

    if (action  && action  !== 'all') query.action  = action;
    // ?success=true|false — filter by outcome
    if (success !== undefined && success !== '') {
      query.success = success === 'true';
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const logs  = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    const total = await AuditLog.countDocuments(query);

    return ApiResponse.success(res, {
      logs,
      total,
      page:       Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      limit:      Number(limit),
    });
  } catch (err) {
    return ApiResponse.error(res, err.message);
  }
};
