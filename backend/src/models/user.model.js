const db = require("../config/database");

const createUser = async ({ name, email, passwordHash }) => {
  const result = await db.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at, updated_at`,
    [name, email, passwordHash]
  );

  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await db.query(
    `SELECT id, name, email, password_hash, created_at, updated_at
     FROM users
     WHERE email = $1`,
    [email]
  );

  return result.rows[0] || null;
};

const findUserById = async (id) => {
  const result = await db.query(
    `SELECT id, name, email, password_hash, created_at, updated_at
     FROM users
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
};

const updatePassword = async (userId, passwordHash) => {
  const result = await db.query(
    `UPDATE users
     SET password_hash = $1,
         updated_at = NOW()
     WHERE id = $2
     RETURNING id, name, email, updated_at`,
    [passwordHash, userId]
  );

  return result.rows[0] || null;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updatePassword,
};
