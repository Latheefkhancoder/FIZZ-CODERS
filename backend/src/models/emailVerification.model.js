/**
 * Email Verification Model — Firestore-backed
 * Stores OTP codes in the Firestore `emailVerificationCodes` collection.
 * Data persists across server restarts.
 */

const { db } = require("../config/firebase");
const crypto = require("crypto");

const COLLECTION = "emailVerificationCodes";

const newId = () => crypto.randomBytes(8).toString("hex");

/**
 * Create a new email verification code record
 * @param {object} params
 * @param {string} params.email
 * @param {string} params.otpHash
 * @param {Date} params.expiresAt
 * @returns {Promise<object>}
 */
const createCode = async ({ email, otpHash, expiresAt }) => {
  if (!db) throw new Error("Firestore not configured. Add Firebase credentials to backend/.env");

  const id = newId();
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

  await db.collection(COLLECTION).doc(id).set(record);

  return { ...record };
};

/**
 * Find the latest unverified code for an email
 * @param {string} email
 * @returns {Promise<object|null>}
 */
const findLatestActiveCode = async (email) => {
  if (!email) return null;
  if (!db) throw new Error("Firestore not configured. Add Firebase credentials to backend/.env");

  const cleanEmail = email.toLowerCase().trim();

  // Fetch all codes for this email, filter unverified client-side (avoids composite index)
  const snapshot = await db.collection(COLLECTION)
    .where("email", "==", cleanEmail)
    .get();

  if (snapshot.empty) return null;

  const unverified = snapshot.docs
    .map((doc) => ({ ...doc.data(), id: doc.id }))
    .filter((r) => r.verified_at === null)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return unverified.length > 0 ? unverified[0] : null;
};

/**
 * Check if an email address has been successfully verified
 * @param {string} email
 * @returns {Promise<boolean>}
 */
const isEmailVerified = async (email) => {
  if (!email) return false;
  if (!db) throw new Error("Firestore not configured. Add Firebase credentials to backend/.env");

  const cleanEmail = email.toLowerCase().trim();

  // Fetch all codes for this email, check if any are verified client-side (avoids composite index)
  const snapshot = await db.collection(COLLECTION)
    .where("email", "==", cleanEmail)
    .get();

  return snapshot.docs.some((doc) => doc.data().verified_at !== null);
};

/**
 * Increment the failed attempt counter for a verification code
 * @param {string} id
 * @returns {Promise<object|null>}
 */
const incrementAttempts = async (id) => {
  if (!db) throw new Error("Firestore not configured. Add Firebase credentials to backend/.env");

  const ref = db.collection(COLLECTION).doc(String(id));
  const doc = await ref.get();
  if (!doc.exists) return null;

  const newAttempts = (doc.data().attempts || 0) + 1;
  await ref.update({ attempts: newAttempts });

  return { id, attempts: newAttempts };
};

/**
 * Mark a verification code as verified
 * @param {string} id
 * @returns {Promise<object|null>}
 */
const markVerified = async (id) => {
  if (!db) throw new Error("Firestore not configured. Add Firebase credentials to backend/.env");

  const ref = db.collection(COLLECTION).doc(String(id));
  const doc = await ref.get();
  if (!doc.exists) return null;

  const verified_at = new Date().toISOString();
  await ref.update({ verified_at });

  return { id, email: doc.data().email, verified_at };
};

/**
 * Invalidate all active (unverified) codes for an email address
 * by setting their expires_at to now (making them expired)
 * @param {string} email
 * @returns {Promise<number>}
 */
const invalidateActiveCodes = async (email) => {
  if (!email) return 0;
  if (!db) throw new Error("Firestore not configured. Add Firebase credentials to backend/.env");

  const cleanEmail = email.toLowerCase().trim();
  const now = new Date().toISOString();

  // Fetch all unverified codes for email, filter active ones client-side
  const snapshot = await db.collection(COLLECTION)
    .where("email", "==", cleanEmail)
    .get();

  if (snapshot.empty) return 0;

  const toInvalidate = snapshot.docs.filter((doc) => {
    const d = doc.data();
    return d.verified_at === null && new Date(d.expires_at) > new Date();
  });

  if (toInvalidate.length === 0) return 0;

  const batch = db.batch();
  toInvalidate.forEach((doc) => batch.update(doc.ref, { expires_at: now }));
  await batch.commit();

  return toInvalidate.length;
};

/**
 * Clear all codes — only used in tests
 */
const clear = async () => {
  if (!db) return;
  const snapshot = await db.collection(COLLECTION).get();
  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
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
