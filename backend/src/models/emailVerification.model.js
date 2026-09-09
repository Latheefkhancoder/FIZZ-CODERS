const db = require("../config/database");

/**
 * Create a new email verification code record
 * @param {object} params
 * @param {string} params.email
 * @param {string} params.otpHash
 * @param {Date} params.expiresAt
 * @returns {Promise<object>}
 */
const createCode = async ({ email, otpHash, expiresAt }) => {
  const queryText = `
    INSERT INTO email_verification_codes (email, otp_hash, expires_at, created_at, verified_at, attempts)
    VALUES ($1, $2, $3, NOW(), NULL, 0)
    RETURNING id, email, otp_hash, expires_at, created_at, verified_at, attempts;
  `;
  const result = await db.query(queryText, [email.toLowerCase().trim(), otpHash, expiresAt]);
  return result.rows[0];
};

/**
 * Find the latest unverified code for an email
 * @param {string} email
 * @returns {Promise<object|null>}
 */
const findLatestActiveCode = async (email) => {
  const queryText = `
    SELECT id, email, otp_hash, expires_at, created_at, verified_at, attempts
    FROM email_verification_codes
    WHERE LOWER(email) = LOWER($1)
      AND verified_at IS NULL
    ORDER BY id DESC
    LIMIT 1;
  `;
  const result = await db.query(queryText, [email]);
  return result.rows[0] || null;
};

/**
 * Check if an email address has been successfully verified
 * @param {string} email
 * @returns {Promise<boolean>}
 */
const isEmailVerified = async (email) => {
  const queryText = `
    SELECT id, verified_at
    FROM email_verification_codes
    WHERE LOWER(email) = LOWER($1)
      AND verified_at IS NOT NULL
    ORDER BY id DESC
    LIMIT 1;
  `;
  const result = await db.query(queryText, [email]);
  return result.rowCount > 0;
};

/**
 * Increment the failed attempt counter for a verification code
 * @param {number|string} id
 * @returns {Promise<object>}
 */
const incrementAttempts = async (id) => {
  const queryText = `
    UPDATE email_verification_codes
    SET attempts = attempts + 1
    WHERE id = $1
    RETURNING id, attempts;
  `;
  const result = await db.query(queryText, [id]);
  return result.rows[0] || null;
};

/**
 * Mark a verification code as verified
 * @param {number|string} id
 * @returns {Promise<object>}
 */
const markVerified = async (id) => {
  const queryText = `
    UPDATE email_verification_codes
    SET verified_at = NOW()
    WHERE id = $1
    RETURNING id, email, verified_at;
  `;
  const result = await db.query(queryText, [id]);
  return result.rows[0] || null;
};

/**
 * Invalidate all active (unverified) codes for an email address
 * @param {string} email
 * @returns {Promise<number>}
 */
const invalidateActiveCodes = async (email) => {
  const queryText = `
    UPDATE email_verification_codes
    SET expires_at = NOW()
    WHERE LOWER(email) = LOWER($1)
      AND verified_at IS NULL
      AND expires_at > NOW();
  `;
  const result = await db.query(queryText, [email]);
  return result.rowCount;
};

module.exports = {
  createCode,
  findLatestActiveCode,
  isEmailVerified,
  incrementAttempts,
  markVerified,
  invalidateActiveCodes,
};
