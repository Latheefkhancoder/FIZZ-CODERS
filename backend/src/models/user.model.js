/**
 * User Model — Firestore-backed
 * Stores registered auth users in the Firestore `authUsers` collection.
 * Falls back gracefully when Firestore is unavailable.
 */

const { db } = require("../config/firebase");
const { generateRandomToken } = require("../utils/crypto");
const crypto = require("crypto");

const COLLECTION = "authUsers";

/**
 * Generate a stable string ID for new users
 */
const newId = () => crypto.randomBytes(8).toString("hex");

/**
 * Find user by normalized email address
 * @param {string} email
 * @returns {Promise<object|null>}
 */
const findByEmail = async (email) => {
  if (!email) return null;
  const cleanEmail = email.toLowerCase().trim();

  if (!db) throw new Error("Firestore not configured. Add Firebase credentials to backend/.env");

  const snapshot = await db.collection(COLLECTION)
    .where("email", "==", cleanEmail)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { ...doc.data(), id: doc.id };
};

/**
 * Find user by ID
 * @param {string} id
 * @returns {Promise<object|null>}
 */
const findById = async (id) => {
  if (id === undefined || id === null) return null;

  if (!db) throw new Error("Firestore not configured. Add Firebase credentials to backend/.env");

  const doc = await db.collection(COLLECTION).doc(String(id)).get();
  if (!doc.exists) return null;
  return { ...doc.data(), id: doc.id };
};

/**
 * Create a new user record
 * @param {object} params
 * @param {string} params.name
 * @param {string} params.email
 * @param {string} params.passwordHash
 * @returns {Promise<object>} Created user without password_hash
 */
const createUser = async ({ name, email, passwordHash }) => {
  if (!db) throw new Error("Firestore not configured. Add Firebase credentials to backend/.env");

  const id = newId();
  const cleanEmail = email.toLowerCase().trim();
  const now = new Date().toISOString();

  const record = {
    id,
    name: name.trim(),
    email: cleanEmail,
    password_hash: passwordHash,
    created_at: now,
    updated_at: now,
  };

  await db.collection(COLLECTION).doc(id).set(record);

  return {
    id: record.id,
    name: record.name,
    email: record.email,
    created_at: record.created_at,
    updated_at: record.updated_at,
  };
};

/**
 * Update user password hash
 * @param {string} userId
 * @param {string} newPasswordHash
 * @returns {Promise<boolean>}
 */
const updatePassword = async (userId, newPasswordHash) => {
  if (!db) throw new Error("Firestore not configured. Add Firebase credentials to backend/.env");

  const ref = db.collection(COLLECTION).doc(String(userId));
  const doc = await ref.get();
  if (!doc.exists) return false;

  await ref.update({
    password_hash: newPasswordHash,
    updated_at: new Date().toISOString(),
  });

  return true;
};

/**
 * Clear all users — only used in tests
 */
const clear = async () => {
  if (!db) return;
  const snapshot = await db.collection(COLLECTION).get();
  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
};

module.exports = {
  findByEmail,
  findById,
  createUser,
  updatePassword,
  clear,
};
