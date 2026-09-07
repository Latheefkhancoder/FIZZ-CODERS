const { errorResponse } = require("../utils/response");
const env = require("../config/env");

/**
 * Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  const errorDetails = env.NODE_ENV === "development" ? { stack: err.stack } : null;

  return errorResponse(res, message, errorDetails, statusCode);
};

module.exports = errorHandler;
