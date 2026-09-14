/**
 * Password Reset Token Model — Firestore-backed
 * Stores hashed reset tokens in the Firestore `passwordResetTokens` collection.
 * Data persists across server restarts.
 */

const { db } = require("../config/firebase");
const crypto = require("crypto");

const COLLECTION = "passwordResetTokens";

const newId = () => crypto.randomBytes(8).toString("hex");

/**
 * Store a new password reset token hash
 * @param {object} params
 * @param {string} params.userId
 * @param {string} params.tokenHash
 * @param {Date} params.expiresAt
 * @returns {Promise<object>}
 */
const createToken = async ({ userId, tokenHash, expiresAt }) => {
  if (!db) throw new Error("Firestore not configured. Add Firebase credentials to backend/.env");

  const id = newId();
  const record = {
    id,
    user_id: String(userId),
    token_hash: tokenHash,
    expires_at: expiresAt instanceof Date ? expiresAt.toISOString() : expiresAt,
    created_at: new Date().toISOString(),
    used_at: null,
  };

  await db.collection(COLLECTION).doc(id).set(record);

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
  if (!db) throw new Error("Firestore not configured. Add Firebase credentials to backend/.env");

  const snapshot = await db.collection(COLLECTION)
    .where("token_hash", "==", tokenHash)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  const data = doc.data();

  // Check used status and expiry client-side (avoids composite indexes)
  if (data.used_at) return null;
  if (new Date(data.expires_at) <= new Date()) return null;

  return { ...data, id: doc.id };
};

/**
 * Mark a specific reset token as used
 * @param {string} tokenId
 * @returns {Promise<boolean>}
 */
const markTokenUsed = async (tokenId) => {
  if (!db) throw new Error("Firestore not configured. Add Firebase credentials to backend/.env");

  const ref = db.collection(COLLECTION).doc(String(tokenId));
  const doc = await ref.get();
  if (!doc.exists) return false;

  await ref.update({ used_at: new Date().toISOString() });
  return true;
};

/**
 * Invalidate all active reset tokens for a specific user
 * @param {string} userId
 * @returns {Promise<number>} Number of invalidated tokens
 */
const invalidateUserTokens = async (userId) => {
  if (!db) throw new Error("Firestore not configured. Add Firebase credentials to backend/.env");

  // Fetch by user_id only, filter unused client-side (avoids composite index)
  const snapshot = await db.collection(COLLECTION)
    .where("user_id", "==", String(userId))
    .get();

  if (snapshot.empty) return 0;

  const now = new Date().toISOString();
  const toInvalidate = snapshot.docs.filter((doc) => !doc.data().used_at);

  if (toInvalidate.length === 0) return 0;

  const batch = db.batch();
  toInvalidate.forEach((doc) => batch.update(doc.ref, { used_at: now }));
  await batch.commit();

  return toInvalidate.length;
};

/**
 * Clear all tokens — only used in tests
 */
const clear = async () => {
  if (!db) return;
  const snapshot = await db.collection(COLLECTION).get();
  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
};

module.exports = {
  createToken,
  findValidToken,
  markTokenUsed,
  invalidateUserTokens,
  clear,
};
