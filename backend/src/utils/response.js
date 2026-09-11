/**
 * Standardized API response helpers
 * Compliant with Phase 14 specifications and backwards-compatible with existing auth.
 */

const successResponse = (res, message, data = null, statusCode = 200) => {
  const responseBody = {
    success: true,
    message,
  };

  if (data !== null && data !== undefined) {
    responseBody.data = data;
  }

  return res.status(statusCode).json(responseBody);
};

const errorResponse = (res, message, error = null, statusCode = 500) => {
  const responseBody = {
    success: false,
    message,
    errors: [],
  };

  if (error !== null && error !== undefined) {
    if (Array.isArray(error)) {
      responseBody.errors = error;
      responseBody.error = error[0] || message;
    } else if (typeof error === "string") {
      responseBody.errors = [error];
      responseBody.error = error;
    } else if (typeof error === "object") {
      responseBody.errors = [error];
      responseBody.error = error;
    }
  }

  return res.status(statusCode).json(responseBody);
};

module.exports = {
  successResponse,
  errorResponse,
};
