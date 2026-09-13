/**
 * User Model
 * Decoupled in-memory storage for authentication users pending Firebase/Firestore integration.
 * Starts empty with zero synthetic or seed data.
 */

const users = new Map();
let nextUserId = 1;

/**
 * Find user by normalized email address
 * @param {string} email
 * @returns {Promise<object|null>}
 */
const findByEmail = async (email) => {
  if (!email) return null;
  const cleanEmail = email.toLowerCase().trim();

  for (const user of users.values()) {
    if (user.email.toLowerCase() === cleanEmail) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        password_hash: user.password_hash,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
    }
  }
  return null;
};

/**
 * Find user by ID
 * @param {number|string} id
 * @returns {Promise<object|null>}
 */
const findById = async (id) => {
  if (id === undefined || id === null) return null;
  const idStr = String(id);

  for (const user of users.values()) {
    if (String(user.id) === idStr) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
    }
  }
  return null;
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
  const id = nextUserId++;
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

  users.set(id, record);

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
 * @param {number|string} userId
 * @param {string} newPasswordHash
 * @returns {Promise<boolean>}
 */
const updatePassword = async (userId, newPasswordHash) => {
  const idStr = String(userId);
  for (const [id, user] of users.entries()) {
    if (String(id) === idStr) {
      user.password_hash = newPasswordHash;
      user.updated_at = new Date().toISOString();
      return true;
    }
  }
  return false;
};

/**
 * Reset in-memory storage (useful for tests)
 */
const clear = () => {
  users.clear();
  nextUserId = 1;
};

module.exports = {
  findByEmail,
  findById,
  createUser,
  updatePassword,
  clear,
};
