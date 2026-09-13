/**
 * Email Verification Model
 * Decoupled in-memory storage for email verification codes pending Firebase/Firestore integration.
 * Starts empty with zero synthetic or seed data.
 */

const codes = new Map();
let nextCodeId = 1;

/**
 * Create a new email verification code record
 * @param {object} params
 * @param {string} params.email
 * @param {string} params.otpHash
 * @param {Date} params.expiresAt
 * @returns {Promise<object>}
 */
const createCode = async ({ email, otpHash, expiresAt }) => {
  const id = nextCodeId++;
  const cleanEmail = email.toLowerCase().trim();
  const now = new Date().toISOString();

  const record = {
    id,
    email: cleanEmail,
    otp_hash: otpHash,
    expires_at: expiresAt instanceof Date ? expiresAt.toISOString() : expiresAt,
    created_at: now,
    verified_at: null,
    attempts: 0,
  };

  codes.set(id, record);

  return {
    id: record.id,
    email: record.email,
    otp_hash: record.otp_hash,
    expires_at: record.expires_at,
    created_at: record.created_at,
    verified_at: record.verified_at,
    attempts: record.attempts,
  };
};

/**
 * Find the latest unverified code for an email
 * @param {string} email
 * @returns {Promise<object|null>}
 */
const findLatestActiveCode = async (email) => {
  if (!email) return null;
  const cleanEmail = email.toLowerCase().trim();

  let latest = null;
  for (const record of codes.values()) {
    if (record.email === cleanEmail && record.verified_at === null) {
      if (!latest || record.id > latest.id) {
        latest = record;
      }
    }
  }

  if (!latest) return null;

  return {
    id: latest.id,
    email: latest.email,
    otp_hash: latest.otp_hash,
    expires_at: latest.expires_at,
    created_at: latest.created_at,
    verified_at: latest.verified_at,
    attempts: latest.attempts,
  };
};

/**
 * Check if an email address has been successfully verified
 * @param {string} email
 * @returns {Promise<boolean>}
 */
const isEmailVerified = async (email) => {
  if (!email) return false;
  const cleanEmail = email.toLowerCase().trim();

  for (const record of codes.values()) {
    if (record.email === cleanEmail && record.verified_at !== null) {
      return true;
    }
  }
  return false;
};

/**
 * Increment the failed attempt counter for a verification code
 * @param {number|string} id
 * @returns {Promise<object|null>}
 */
const incrementAttempts = async (id) => {
  const idStr = String(id);
  for (const [codeId, record] of codes.entries()) {
    if (String(codeId) === idStr) {
      record.attempts += 1;
      return {
        id: record.id,
        attempts: record.attempts,
      };
    }
  }
  return null;
};

/**
 * Mark a verification code as verified
 * @param {number|string} id
 * @returns {Promise<object|null>}
 */
const markVerified = async (id) => {
  const idStr = String(id);
  for (const [codeId, record] of codes.entries()) {
    if (String(codeId) === idStr) {
      record.verified_at = new Date().toISOString();
      return {
        id: record.id,
        email: record.email,
        verified_at: record.verified_at,
      };
    }
  }
  return null;
};

/**
 * Invalidate all active (unverified) codes for an email address
 * @param {string} email
 * @returns {Promise<number>}
 */
const invalidateActiveCodes = async (email) => {
  if (!email) return 0;
  const cleanEmail = email.toLowerCase().trim();
  const now = new Date().toISOString();
  let count = 0;

  for (const record of codes.values()) {
    if (
      record.email === cleanEmail &&
      record.verified_at === null &&
      new Date(record.expires_at) > new Date()
    ) {
      record.expires_at = now;
      count++;
    }
  }

  return count;
};

/**
 * Reset in-memory storage (useful for tests)
 */
const clear = () => {
  codes.clear();
  nextCodeId = 1;
};

module.exports = {
  createCode,
  findLatestActiveCode,
  isEmailVerified,
  incrementAttempts,
  markVerified,
  invalidateActiveCodes,
  clear,
};
