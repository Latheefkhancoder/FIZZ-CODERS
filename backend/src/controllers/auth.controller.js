const { authService } = require("../services");
const { successResponse } = require("../utils/response");

/**
 * Register a new user account (sends verification OTP)
 * @route POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    const result = await authService.registerUser({ fullName, email, password });
    return successResponse(res, result.message, { email: result.email }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Verify email using OTP code
 * @route POST /api/auth/verify-email
 */
const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyEmail({ email, otp });
    return successResponse(res, result.message, { email: result.email, verified: true }, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Resend verification OTP code
 * @route POST /api/auth/resend-verification
 */
const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.resendVerification(email);
    return successResponse(res, result.message, null, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Login user (requires verified email)
 * @route POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;
    const result = await authService.loginUser({ email, password, rememberMe });
    return successResponse(res, "Login successful", result, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Request password reset
 * @route POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.requestPasswordReset(email);
    return successResponse(res, result.message, null, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Verify reset token validity
 * @route GET /api/auth/verify-reset-token
 */
const verifyResetToken = async (req, res, next) => {
  try {
    const { token } = req.query;
    const result = await authService.verifyResetToken(token);
    return successResponse(
      res,
      result.valid ? "Token is valid" : "Token is invalid or expired",
      result,
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password using token
 * @route POST /api/auth/reset-password
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword({ token, newPassword });
    return successResponse(res, "Password has been successfully reset", null, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Get authenticated user profile
 * @route GET /api/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    return successResponse(res, "User profile retrieved", { user }, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyEmail,
  resendVerification,
  login,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  getMe,
};

