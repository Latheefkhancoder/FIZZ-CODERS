const db = require("../config/database");

/**
 * Find user by normalized email address
 * @param {string} email
 * @returns {Promise<object|null>}
 */
const findByEmail = async (email) => {
  const queryText = `
    SELECT id, name, email, password_hash, created_at, updated_at
    FROM users
    WHERE LOWER(email) = LOWER($1)
    LIMIT 1;
  `;
  const result = await db.query(queryText, [email]);
  return result.rows[0] || null;
};

/**
 * Find user by ID
 * @param {number|string} id
 * @returns {Promise<object|null>}
 */
const findById = async (id) => {
  const queryText = `
    SELECT id, name, email, created_at, updated_at
    FROM users
    WHERE id = $1
    LIMIT 1;
  `;
  const result = await db.query(queryText, [id]);
  return result.rows[0] || null;
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
  const queryText = `
    INSERT INTO users (name, email, password_hash, created_at, updated_at)
    VALUES ($1, $2, $3, NOW(), NOW())
    RETURNING id, name, email, created_at, updated_at;
  `;
  const result = await db.query(queryText, [name, email.toLowerCase().trim(), passwordHash]);
  return result.rows[0];
};

/**
 * Update user password hash
 * @param {number|string} userId
 * @param {string} newPasswordHash
 * @returns {Promise<boolean>}
 */
const updatePassword = async (userId, newPasswordHash) => {
  const queryText = `
    UPDATE users
    SET password_hash = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id;
  `;
  const result = await db.query(queryText, [newPasswordHash, userId]);
  return result.rowCount > 0;
};

module.exports = {
  findByEmail,
  findById,
  createUser,
  updatePassword,
};
