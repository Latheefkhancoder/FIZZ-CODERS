const db = require("../config/database");

/**
 * Store a new password reset token hash
 * @param {object} params
 * @param {number|string} params.userId
 * @param {string} params.tokenHash
 * @param {Date} params.expiresAt
 * @returns {Promise<object>}
 */
const createToken = async ({ userId, tokenHash, expiresAt }) => {
  const queryText = `
    INSERT INTO password_reset_tokens (user_id, token_hash, expires_at, created_at, used_at)
    VALUES ($1, $2, $3, NOW(), NULL)
    RETURNING id, user_id, token_hash, expires_at, created_at;
  `;
  const result = await db.query(queryText, [userId, tokenHash, expiresAt]);
  return result.rows[0];
};

/**
 * Find a valid (non-expired, non-used) reset token by hash
 * @param {string} tokenHash
 * @returns {Promise<object|null>}
 */
const findValidToken = async (tokenHash) => {
  const queryText = `
    SELECT id, user_id, token_hash, expires_at, created_at, used_at
    FROM password_reset_tokens
    WHERE token_hash = $1
      AND expires_at > NOW()
      AND used_at IS NULL
    LIMIT 1;
  `;
  const result = await db.query(queryText, [tokenHash]);
  return result.rows[0] || null;
};

/**
 * Mark a specific reset token as used
 * @param {number|string} tokenId
 * @returns {Promise<boolean>}
 */
const markTokenUsed = async (tokenId) => {
  const queryText = `
    UPDATE password_reset_tokens
    SET used_at = NOW()
    WHERE id = $1
    RETURNING id;
  `;
  const result = await db.query(queryText, [tokenId]);
  return result.rowCount > 0;
};

/**
 * Invalidate all active reset tokens for a specific user
 * @param {number|string} userId
 * @returns {Promise<number>} Number of invalidated tokens
 */
const invalidateUserTokens = async (userId) => {
  const queryText = `
    UPDATE password_reset_tokens
    SET used_at = NOW()
    WHERE user_id = $1
      AND used_at IS NULL;
  `;
  const result = await db.query(queryText, [userId]);
  return result.rowCount;
};

module.exports = {
  createToken,
  findValidToken,
  markTokenUsed,
  invalidateUserTokens,
};
