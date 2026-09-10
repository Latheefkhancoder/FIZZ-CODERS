const {
  userModel,
  passwordResetTokenModel,
  emailVerificationModel,
} = require("../models");
const {
  hashPassword,
  comparePassword,
  generateRandomToken,
  generateOtp,
  hashToken,
  generateJwt,
} = require("../utils/crypto");
const emailService = require("./email.service");

const OTP_EXPIRATION_MS = 10 * 60 * 1000; // 10 minutes
const MAX_OTP_ATTEMPTS = 5;

/**
 * Register a new user and generate/send verification OTP
 * @param {object} params
 * @param {string} params.fullName
 * @param {string} params.email
 * @param {string} params.password
 * @returns {Promise<{ email: string, message: string }>}
 */
const registerUser = async ({ fullName, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Check if user already exists
  const existingUser = await userModel.findByEmail(normalizedEmail);
  if (existingUser) {
    const isVerified = await emailVerificationModel.isEmailVerified(normalizedEmail);
    if (isVerified) {
      const error = new Error("An account with this email already exists");
      error.statusCode = 409;
      throw error;
    }

    // If existing user is unverified, update password and name
    const passwordHash = await hashPassword(password);
    await userModel.updatePassword(existingUser.id, passwordHash);
  } else {
    // Hash password & create user record
    const passwordHash = await hashPassword(password);
    await userModel.createUser({
      name: fullName.trim(),
      email: normalizedEmail,
      passwordHash,
    });
  }

  // Invalidate any previous active verification codes
  await emailVerificationModel.invalidateActiveCodes(normalizedEmail);

  // Generate secure 6-digit OTP
  const otp = generateOtp(6);
  const otpHash = hashToken(otp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRATION_MS);

  // Store hashed OTP in database
  await emailVerificationModel.createCode({
    email: normalizedEmail,
    otpHash,
    expiresAt,
  });

  // Send verification email with raw OTP
  await emailService.sendEmailVerificationOtp(normalizedEmail, otp);

  // Return success response WITHOUT authentication token
  return {
    email: normalizedEmail,
    message: "Registration successful. A verification code has been sent to your email.",
  };
};

/**
 * Verify email using submitted 6-digit OTP
 * @param {object} params
 * @param {string} params.email
 * @param {string} params.otp
 * @returns {Promise<{ verified: boolean, email: string, message: string }>}
 */
const verifyEmail = async ({ email, otp }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Verify user exists
  const user = await userModel.findByEmail(normalizedEmail);
  if (!user) {
    const error = new Error("Invalid email or verification code");
    error.statusCode = 400;
    throw error;
  }

  // Check if already verified
  const alreadyVerified = await emailVerificationModel.isEmailVerified(normalizedEmail);
  if (alreadyVerified) {
    return {
      verified: true,
      email: normalizedEmail,
      message: "Email has already been verified.",
    };
  }

  // Find latest active code
  const codeRecord = await emailVerificationModel.findLatestActiveCode(normalizedEmail);
  if (!codeRecord) {
    const error = new Error("Invalid or expired verification code. Please request a new one.");
    error.statusCode = 400;
    throw error;
  }

  // Check expiration
  if (new Date(codeRecord.expires_at) < new Date()) {
    const error = new Error("Verification code has expired. Please request a new one.");
    error.statusCode = 400;
    throw error;
  }

  // Check attempt limit
  if (codeRecord.attempts >= MAX_OTP_ATTEMPTS) {
    const error = new Error("Too many failed attempts. Please request a new verification code.");
    error.statusCode = 400;
    throw error;
  }

  // Validate OTP hash
  const incomingHash = hashToken(otp.trim());
  if (incomingHash !== codeRecord.otp_hash) {
    await emailVerificationModel.incrementAttempts(codeRecord.id);
    const remaining = MAX_OTP_ATTEMPTS - (codeRecord.attempts + 1);
    const error = new Error(
      remaining > 0
        ? `Invalid verification code. ${remaining} attempt(s) remaining.`
        : "Invalid verification code. Maximum attempts exceeded. Please request a new code."
    );
    error.statusCode = 400;
    throw error;
  }

  // Mark as verified
  await emailVerificationModel.markVerified(codeRecord.id);

  // Invalidate any remaining codes for this email
  await emailVerificationModel.invalidateActiveCodes(normalizedEmail);

  return {
    verified: true,
    email: normalizedEmail,
    message: "Email verified successfully.",
  };
};

/**
 * Resend verification OTP code
 * @param {string} email
 * @returns {Promise<{ message: string }>}
 */
const resendVerification = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await userModel.findByEmail(normalizedEmail);
  if (!user) {
    // Generic response to avoid email enumeration
    return {
      message: "If an account exists for this email, a verification code has been sent.",
    };
  }

  const isVerified = await emailVerificationModel.isEmailVerified(normalizedEmail);
  if (isVerified) {
    const error = new Error("This email has already been verified.");
    error.statusCode = 400;
    throw error;
  }

  // Invalidate previous active codes
  await emailVerificationModel.invalidateActiveCodes(normalizedEmail);

  // Generate new 6-digit OTP
  const otp = generateOtp(6);
  const otpHash = hashToken(otp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRATION_MS);

  await emailVerificationModel.createCode({
    email: normalizedEmail,
    otpHash,
    expiresAt,
  });

  await emailService.sendEmailVerificationOtp(normalizedEmail, otp);

  return {
    message: "A new verification code has been sent to your email.",
  };
};

const HARDCODED_ACCOUNTS = [
  {
    identifiers: ["admin@fizz.com", "admin", "arun@gmail.com"],
    passwords: ["Admin@123", "admin123"],
    user: {
      id: "admin-1",
      name: "Admin User",
      email: "admin@fizz.com",
      role: "admin",
    },
  },
  {
    identifiers: ["member@fizz.com", "member", "priya@gmail.com"],
    passwords: ["Member@123", "member123"],
    user: {
      id: "member-1",
      name: "Team Member",
      email: "member@fizz.com",
      role: "member",
    },
  },
];

/**
 * Authenticate user login (requires verified email)
 * @param {object} params
 * @param {string} params.email
 * @param {string} params.password
 * @param {boolean} params.rememberMe
 * @returns {Promise<{ user: object, token: string }>}
 */
const loginUser = async ({ email, password, rememberMe = false }) => {
  const normalizedEmail = (email || "").toLowerCase().trim();

  // Check hardcoded credentials for Admin & Member
  const hardcodedMatch = HARDCODED_ACCOUNTS.find((acc) =>
    acc.identifiers.includes(normalizedEmail)
  );

  if (hardcodedMatch) {
    if (!hardcodedMatch.passwords.includes(password)) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const safeUser = {
      id: hardcodedMatch.user.id,
      name: hardcodedMatch.user.name,
      email: hardcodedMatch.user.email,
      role: hardcodedMatch.user.role,
    };

    const token = generateJwt(safeUser, Boolean(rememberMe));

    return {
      user: safeUser,
      token,
    };
  }

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

  // Verify email verification status in email_verification_codes
  const isVerified = await emailVerificationModel.isEmailVerified(normalizedEmail);
  if (!isVerified) {
    const error = new Error("Email verification required. Please verify your email before logging in.");
    error.statusCode = 403;
    error.requiresVerification = true;
    error.email = normalizedEmail;
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
    await emailService.sendPasswordResetEmail(user.email, rawToken);
  }

  // Always return identical generic message without resetToken or link to prevent account enumeration
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
  // First try findById from database / mock
  try {
    const user = await userModel.findById(userId);
    if (user) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      };
    }
  } catch (err) {
    // Database query failed (e.g. string ID on integer column) - check hardcoded fallback below
  }

  // Fallback for hardcoded admin & member
  if (userId === "admin-1" || userId === "admin") {
    return {
      id: "admin-1",
      name: "Admin User",
      email: "admin@fizz.com",
      role: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  if (userId === "member-1" || userId === "member") {
    return {
      id: "member-1",
      name: "Team Member",
      email: "member@fizz.com",
      role: "member",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const error = new Error("User not found");
  error.statusCode = 404;
  throw error;
};

module.exports = {
  registerUser,
  verifyEmail,
  resendVerification,
  loginUser,
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
  getCurrentUser,
};

