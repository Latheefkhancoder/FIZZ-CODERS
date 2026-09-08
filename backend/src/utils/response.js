/**
 * Standardized API response helpers
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
  };

  if (error !== null && error !== undefined) {
    responseBody.error = error;
  }

  return res.status(statusCode).json(responseBody);
};

module.exports = {
  successResponse,
  errorResponse,
};
