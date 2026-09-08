const express = require("express");
const { authController } = require("../controllers");
const { authenticate, validate } = require("../middleware");
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} = require("../validators");

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user account
 * @access Public
 */
router.post("/register", validate(validateRegister), authController.register);

/**
 * @route POST /api/auth/login
 * @desc Authenticate user and get JWT
 * @access Public
 */
router.post("/login", validate(validateLogin), authController.login);

/**
 * @route POST /api/auth/forgot-password
 * @desc Request password reset email
 * @access Public
 */
router.post("/forgot-password", validate(validateForgotPassword), authController.forgotPassword);

/**
 * @route POST /api/auth/reset-password
 * @desc Reset password using token
 * @access Public
 */
router.post("/reset-password", validate(validateResetPassword), authController.resetPassword);

/**
 * @route GET /api/auth/me
 * @desc Get current authenticated user profile
 * @access Private (Requires Bearer token)
 */
router.get("/me", authenticate, authController.getMe);

module.exports = router;
