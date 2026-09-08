const bcrypt = require("bcrypt");
const { userModel } = require("../models");

const registerUser = async ({ name, email, password }) => {
  const existingUser = await userModel.findUserByEmail(email);

  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await userModel.createUser({
    name,
    email,
    passwordHash,
  });

  return user;
};

const loginUser = async ({ email, password }) => {
  const user = await userModel.findUserByEmail(email);

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!passwordMatches) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

module.exports = {
  registerUser,
  loginUser,
};
