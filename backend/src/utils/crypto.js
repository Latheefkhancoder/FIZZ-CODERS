const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../config/env");

const SALT_ROUNDS = 10;

/**
 * Hash a plain password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Password hash
 */
const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare a plain password with a bcrypt hash
 * @param {string} password - Plain text password
 * @param {string} hash - Bcrypt hash from DB
 * @returns {Promise<boolean>} True if match
 */
const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate a cryptographically secure random reset token
 * @param {number} bytes - Number of random bytes
 * @returns {string} Hexadecimal string
 */
const generateRandomToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

/**
 * Deterministically hash a token for secure database storage
 * @param {string} token - Raw token string
 * @returns {string} SHA-256 hash hex string
 */
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/**
 * Generate a cryptographically secure random N-digit numeric OTP
 * @param {number} length - Number of digits (default 6)
 * @returns {string} Numeric string
 */
const generateOtp = (length = 6) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return crypto.randomInt(min, max + 1).toString();
};

/**
 * Generate a JWT token for an authenticated user
 * @param {object} payload - User identification payload (e.g. { id, email, name })
 * @param {boolean} rememberMe - Whether extended expiration applies
 * @returns {string} Signed JWT token
 */
const generateJwt = (payload, rememberMe = false) => {
  const expiresIn = rememberMe ? env.JWT_REMEMBER_EXPIRES_IN : env.JWT_EXPIRES_IN;
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token string
 * @returns {object} Decoded payload
 */
const verifyJwt = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

module.exports = {
  hashPassword,
  comparePassword,
  generateRandomToken,
  generateOtp,
  hashToken,
  generateJwt,
  verifyJwt,
};

