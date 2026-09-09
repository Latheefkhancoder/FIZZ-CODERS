const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate registration request body
 * @param {object} body
 * @returns {{ isValid: boolean, errors: string[] }}
 */
const validateRegister = (body) => {
  const errors = [];
  const { fullName, email, password, confirmPassword } = body || {};

  if (!fullName || typeof fullName !== "string" || fullName.trim().length === 0) {
    errors.push("Full name is required");
  } else if (fullName.trim().length > 100) {
    errors.push("Full name must not exceed 100 characters");
  }

  if (!email || typeof email !== "string" || email.trim().length === 0) {
    errors.push("Email is required");
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push("Invalid email format");
  } else if (email.trim().length > 255) {
    errors.push("Email must not exceed 255 characters");
  }

  if (!password || typeof password !== "string") {
    errors.push("Password is required");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (!confirmPassword || typeof confirmPassword !== "string") {
    errors.push("Confirm password is required");
  } else if (password && confirmPassword !== password) {
    errors.push("Passwords do not match");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate login request body
 * @param {object} body
 * @returns {{ isValid: boolean, errors: string[] }}
 */
const validateLogin = (body) => {
  const errors = [];
  const { email, password } = body || {};

  if (!email || typeof email !== "string" || email.trim().length === 0) {
    errors.push("Email is required");
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push("Invalid email format");
  }

  if (!password || typeof password !== "string") {
    errors.push("Password is required");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate forgot password request body
 * @param {object} body
 * @returns {{ isValid: boolean, errors: string[] }}
 */
const validateForgotPassword = (body) => {
  const errors = [];
  const { email } = body || {};

  if (!email || typeof email !== "string" || email.trim().length === 0) {
    errors.push("Email is required");
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push("Invalid email format");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate reset password request body
 * @param {object} body
 * @returns {{ isValid: boolean, errors: string[] }}
 */
const validateResetPassword = (body) => {
  const errors = [];
  const { token, newPassword, confirmPassword } = body || {};

  if (!token || typeof token !== "string" || token.trim().length === 0) {
    errors.push("Reset token is required");
  }

  if (!newPassword || typeof newPassword !== "string") {
    errors.push("New password is required");
  } else if (newPassword.length < 6) {
    errors.push("New password must be at least 6 characters long");
  }

  if (!confirmPassword || typeof confirmPassword !== "string") {
    errors.push("Confirm password is required");
  } else if (newPassword && confirmPassword !== newPassword) {
    errors.push("Passwords do not match");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate verify email OTP request body
 * @param {object} body
 * @returns {{ isValid: boolean, errors: string[] }}
 */
const validateVerifyEmail = (body) => {
  const errors = [];
  const { email, otp } = body || {};

  if (!email || typeof email !== "string" || email.trim().length === 0) {
    errors.push("Email is required");
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push("Invalid email format");
  }

  if (!otp || typeof otp !== "string" || otp.trim().length === 0) {
    errors.push("Verification code is required");
  } else if (!/^\d{6}$/.test(otp.trim())) {
    errors.push("Verification code must be a 6-digit number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate resend verification OTP request body
 * @param {object} body
 * @returns {{ isValid: boolean, errors: string[] }}
 */
const validateResendVerification = (body) => {
  const errors = [];
  const { email } = body || {};

  if (!email || typeof email !== "string" || email.trim().length === 0) {
    errors.push("Email is required");
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push("Invalid email format");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateRegister,
  validateVerifyEmail,
  validateResendVerification,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
};

