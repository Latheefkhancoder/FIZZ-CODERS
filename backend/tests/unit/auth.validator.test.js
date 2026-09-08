const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} = require("../../src/validators");

describe("Auth Validators Unit Tests", () => {
  describe("validateRegister", () => {
    it("should pass for valid registration data", () => {
      const result = validateRegister({
        fullName: "John Doe",
        email: "john@example.com",
        password: "password123",
        confirmPassword: "password123",
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should fail when fullName is missing", () => {
      const result = validateRegister({
        email: "john@example.com",
        password: "password123",
        confirmPassword: "password123",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Full name is required");
    });

    it("should fail for invalid email format", () => {
      const result = validateRegister({
        fullName: "John Doe",
        email: "invalid-email",
        password: "password123",
        confirmPassword: "password123",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Invalid email format");
    });

    it("should fail when password is less than 6 characters", () => {
      const result = validateRegister({
        fullName: "John Doe",
        email: "john@example.com",
        password: "123",
        confirmPassword: "123",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Password must be at least 6 characters long");
    });

    it("should fail when passwords do not match", () => {
      const result = validateRegister({
        fullName: "John Doe",
        email: "john@example.com",
        password: "password123",
        confirmPassword: "differentpassword",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Passwords do not match");
    });
  });

  describe("validateLogin", () => {
    it("should pass for valid login credentials", () => {
      const result = validateLogin({
        email: "john@example.com",
        password: "password123",
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should fail for missing email or password", () => {
      const result = validateLogin({});
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe("validateForgotPassword", () => {
    it("should pass for valid email", () => {
      const result = validateForgotPassword({ email: "john@example.com" });
      expect(result.isValid).toBe(true);
    });

    it("should fail for empty or invalid email", () => {
      const result = validateForgotPassword({ email: "not-an-email" });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Invalid email format");
    });
  });

  describe("validateResetPassword", () => {
    it("should pass for valid token and matching passwords", () => {
      const result = validateResetPassword({
        token: "sample-token",
        newPassword: "newpassword123",
        confirmPassword: "newpassword123",
      });
      expect(result.isValid).toBe(true);
    });

    it("should fail when token is missing", () => {
      const result = validateResetPassword({
        newPassword: "newpassword123",
        confirmPassword: "newpassword123",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Reset token is required");
    });

    it("should fail when passwords do not match", () => {
      const result = validateResetPassword({
        token: "sample-token",
        newPassword: "newpassword123",
        confirmPassword: "mismatchpassword",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Passwords do not match");
    });
  });
});
