/**
 * Password Reset Token Model
 * Decoupled in-memory storage for reset tokens pending Firebase/Firestore integration.
 * Starts empty with zero synthetic or seed data.
 */

const tokens = new Map();
let nextTokenId = 1;

/**
 * Store a new password reset token hash
 * @param {object} params
 * @param {number|string} params.userId
 * @param {string} params.tokenHash
 * @param {Date} params.expiresAt
 * @returns {Promise<object>}
 */
const createToken = async ({ userId, tokenHash, expiresAt }) => {
  const id = nextTokenId++;
  const record = {
    id,
    user_id: userId,
    token_hash: tokenHash,
    expires_at: expiresAt instanceof Date ? expiresAt.toISOString() : expiresAt,
    created_at: new Date().toISOString(),
    used_at: null,
  };

  tokens.set(id, record);

  return {
    id: record.id,
    user_id: record.user_id,
    token_hash: record.token_hash,
    expires_at: record.expires_at,
    created_at: record.created_at,
  };
};

/**
 * Find a valid (non-expired, non-used) reset token by hash
 * @param {string} tokenHash
 * @returns {Promise<object|null>}
 */
const findValidToken = async (tokenHash) => {
  if (!tokenHash) return null;
  const now = new Date();

  for (const token of tokens.values()) {
    if (token.token_hash === tokenHash && !token.used_at && new Date(token.expires_at) > now) {
      return {
        id: token.id,
        user_id: token.user_id,
        token_hash: token.token_hash,
        expires_at: token.expires_at,
        created_at: token.created_at,
        used_at: token.used_at,
      };
    }
  }
  return null;
};

/**
 * Mark a specific reset token as used
 * @param {number|string} tokenId
 * @returns {Promise<boolean>}
 */
const markTokenUsed = async (tokenId) => {
  const idStr = String(tokenId);
  for (const [id, token] of tokens.entries()) {
    if (String(id) === idStr) {
      token.used_at = new Date().toISOString();
      return true;
    }
  }
  return false;
};

/**
 * Invalidate all active reset tokens for a specific user
 * @param {number|string} userId
 * @returns {Promise<number>} Number of invalidated tokens
 */
const invalidateUserTokens = async (userId) => {
  const userStr = String(userId);
  let count = 0;
  const now = new Date().toISOString();

  for (const token of tokens.values()) {
    if (String(token.user_id) === userStr && !token.used_at) {
      token.used_at = now;
      count++;
    }
  }

  return count;
};

/**
 * Reset in-memory storage (useful for tests)
 */
const clear = () => {
  tokens.clear();
  nextTokenId = 1;
};

module.exports = {
  createToken,
  findValidToken,
  markTokenUsed,
  invalidateUserTokens,
  clear,
};
