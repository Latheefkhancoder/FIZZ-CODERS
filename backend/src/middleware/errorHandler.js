const { errorResponse } = require("../utils/response");
const env = require("../config/env");

/**
 * Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.code === "ECONNREFUSED") {
    statusCode = 500;
    message = "Service connection error";
  }

  // In production, do not leak detailed stack traces or internal errors
  const errorDetails = env.NODE_ENV === "development" ? { stack: err.stack, code: err.code } : null;

  return errorResponse(res, message, errorDetails, statusCode);
};

module.exports = errorHandler;
