const { userModel, passwordResetTokenModel } = require("../models");
const {
  hashPassword,
  comparePassword,
  generateRandomToken,
  hashToken,
  generateJwt,
} = require("../utils/crypto");
const emailService = require("./email.service");

/**
 * Register a new user
 * @param {object} params
 * @param {string} params.fullName
 * @param {string} params.email
 * @param {string} params.password
 * @returns {Promise<{ user: object, token: string }>}
 */
const registerUser = async ({ fullName, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Check if user already exists
  const existingUser = await userModel.findByEmail(normalizedEmail);
  if (existingUser) {
    const error = new Error("An account with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user record
  const newUser = await userModel.createUser({
    name: fullName.trim(),
    email: normalizedEmail,
    passwordHash,
  });

  const safeUser = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
  };

  // Generate session token
  const token = generateJwt(safeUser);

  return {
    user: safeUser,
    token,
  };
};

/**
 * Authenticate user login
 * @param {object} params
 * @param {string} params.email
 * @param {string} params.password
 * @param {boolean} params.rememberMe
 * @returns {Promise<{ user: object, token: string }>}
 */
const loginUser = async ({ email, password, rememberMe = false }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Find user by email
  const user = await userModel.findByEmail(normalizedEmail);
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // Verify password
  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  // Generate JWT token with rememberMe configuration
  const token = generateJwt(safeUser, Boolean(rememberMe));

  return {
    user: safeUser,
    token,
  };
};

/**
 * Request password reset email
 * @param {string} email
 * @returns {Promise<{ message: string }>}
 */
const requestPasswordReset = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await userModel.findByEmail(normalizedEmail);

  if (user) {
    // Generate secure random token
    const rawToken = generateRandomToken(32);
    const tokenHash = hashToken(rawToken);

    // Invalidate existing active tokens for this user
    await passwordResetTokenModel.invalidateUserTokens(user.id);

    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Store hashed token in database
    await passwordResetTokenModel.createToken({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    // Send reset email containing the raw token
    const emailResult = await emailService.sendPasswordResetEmail(user.email, rawToken);
    return {
      message: "If an account exists for this email, a password reset link has been sent.",
      resetLink: emailResult?.link,
      resetToken: rawToken,
    };
  }

  // Always return identical generic message to prevent account enumeration
  return {
    message: "If an account exists for this email, a password reset link has been sent.",
  };
};

/**
 * Verify if a reset token is valid
 * @param {string} token - Raw reset token
 * @returns {Promise<{ valid: boolean }>}
 */
const verifyResetToken = async (token) => {
  if (!token) return { valid: false };
  const tokenHash = hashToken(token);
  const tokenRecord = await passwordResetTokenModel.findValidToken(tokenHash);
  return { valid: Boolean(tokenRecord) };
};

/**
 * Reset password using valid reset token
 * @param {object} params
 * @param {string} params.token - Raw reset token
 * @param {string} params.newPassword - New plain password
 * @returns {Promise<{ success: boolean }>}
 */
const resetPassword = async ({ token, newPassword }) => {
  const tokenHash = hashToken(token);

  // Find valid, non-expired, unused token
  const tokenRecord = await passwordResetTokenModel.findValidToken(tokenHash);
  if (!tokenRecord) {
    const error = new Error("Invalid or expired password reset token");
    error.statusCode = 400;
    throw error;
  }

  // Hash new password
  const newPasswordHash = await hashPassword(newPassword);

  // Update user's password
  await userModel.updatePassword(tokenRecord.user_id, newPasswordHash);

  // Mark token as used
  await passwordResetTokenModel.markTokenUsed(tokenRecord.id);

  // Invalidate any other remaining tokens
  await passwordResetTokenModel.invalidateUserTokens(tokenRecord.user_id);

  return {
    success: true,
  };
};

/**
 * Get profile data for authenticated user
 * @param {number|string} userId
 * @returns {Promise<object>}
 */
const getCurrentUser = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
};

module.exports = {
  registerUser,
  loginUser,
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
  getCurrentUser,
};
