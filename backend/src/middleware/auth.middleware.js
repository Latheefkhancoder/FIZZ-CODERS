const { verifyJwt } = require("../utils/crypto");
const { errorResponse } = require("../utils/response");

/**
 * Authentication middleware for protected endpoints
 * Extracts Bearer token from Authorization header and verifies it
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return errorResponse(res, "Authorization header missing", null, 401);
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return errorResponse(res, "Invalid authorization format. Format must be: Bearer <token>", null, 401);
  }

  const token = parts[1];

  try {
    const decoded = verifyJwt(token);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return errorResponse(res, "Token has expired", null, 401);
    }
    return errorResponse(res, "Invalid or malformed authentication token", null, 401);
  }
};

module.exports = authenticate;
