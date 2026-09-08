const { errorResponse } = require("../utils/response");
const env = require("../config/env");

/**
 * Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle PostgreSQL specific errors gracefully
  if (err.code === "23505") {
    // Unique violation
    statusCode = 409;
    message = "A record with this information already exists";
  } else if (err.code === "28P01" || err.code === "3D000" || err.code === "ECONNREFUSED") {
    statusCode = 500;
    message = "Database connection error";
  }

  // In production, do not leak detailed stack traces or internal errors
  const errorDetails = env.NODE_ENV === "development" ? { stack: err.stack, code: err.code } : null;

  return errorResponse(res, message, errorDetails, statusCode);
};

module.exports = errorHandler;
