const healthService = require("../services/health.service");
const { successResponse } = require("../utils/response");

/**
 * Health check controller
 * @route GET /api/health
 */
const getHealth = (req, res, next) => {
  try {
    const healthData = healthService.getHealthStatus();
    return successResponse(res, "FIZZ-CONNECT API is running healthy", healthData, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHealth,
};
