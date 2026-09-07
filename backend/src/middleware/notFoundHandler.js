const { errorResponse } = require("../utils/response");

/**
 * 404 Not Found Middleware
 */
const notFoundHandler = (req, res, _next) => {
  return errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, null, 404);
};

module.exports = notFoundHandler;
