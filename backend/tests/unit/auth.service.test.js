const { authService } = require("../../src/services");
const {
  userModel,
  passwordResetTokenModel,
  emailVerificationModel,
} = require("../../src/models");
const emailService = require("../../src/services/email.service");
const { hashPassword, hashToken } = require("../../src/utils/crypto");

jest.mock("../../src/models/user.model");
jest.mock("../../src/models/passwordResetToken.model");
jest.mock("../../src/models/emailVerification.model");
jest.mock("../../src/services/email.service");

describe("Auth Service Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should successfully register a new user and send OTP without returning token", async () => {
      userModel.findByEmail.mockResolvedValue(null);
      userModel.createUser.mockResolvedValue({
        id: 1,
        name: "John Doe",
        email: "john@example.com",
      });
      emailVerificationModel.invalidateActiveCodes.mockResolvedValue(0);
      emailVerificationModel.createCode.mockResolvedValue({ id: 1 });
      emailService.sendEmailVerificationOtp.mockResolvedValue({ delivered: true });

      const result = await authService.registerUser({
        fullName: "John Doe",
        email: "john@example.com",
        password: "password123",
      });

      expect(userModel.findByEmail).toHaveBeenCalledWith("john@example.com");
      expect(userModel.createUser).toHaveBeenCalled();
      expect(emailVerificationModel.createCode).toHaveBeenCalled();
      expect(emailService.sendEmailVerificationOtp).toHaveBeenCalledWith(
        "john@example.com",
        expect.any(String)
      );
      expect(result.email).toBe("john@example.com");
      expect(result).not.toHaveProperty("token");
    });

    it("should throw 409 conflict if email already exists and is verified", async () => {
      userModel.findByEmail.mockResolvedValue({ id: 1, email: "john@example.com" });
      emailVerificationModel.isEmailVerified.mockResolvedValue(true);

      await expect(
        authService.registerUser({
          fullName: "John Doe",
          email: "john@example.com",
          password: "password123",
        })
      ).rejects.toMatchObject({
        statusCode: 409,
        message: "An account with this email already exists",
      });
    });
  });

  describe("verifyEmail", () => {
    it("should successfully verify email with valid OTP", async () => {
      userModel.findByEmail.mockResolvedValue({ id: 1, email: "john@example.com" });
      emailVerificationModel.isEmailVerified.mockResolvedValue(false);
      emailVerificationModel.findLatestActiveCode.mockResolvedValue({
        id: 10,
        email: "john@example.com",
        otp_hash: hashToken("123456"),
        expires_at: new Date(Date.now() + 600000),
        attempts: 0,
      });
      emailVerificationModel.markVerified.mockResolvedValue({ id: 10 });
      emailVerificationModel.invalidateActiveCodes.mockResolvedValue(0);

      const result = await authService.verifyEmail({
        email: "john@example.com",
        otp: "123456",
      });

      expect(emailVerificationModel.markVerified).toHaveBeenCalledWith(10);
      expect(result.verified).toBe(true);
      expect(result.email).toBe("john@example.com");
    });

    it("should reject invalid OTP and increment attempts", async () => {
      userModel.findByEmail.mockResolvedValue({ id: 1, email: "john@example.com" });
      emailVerificationModel.isEmailVerified.mockResolvedValue(false);
      emailVerificationModel.findLatestActiveCode.mockResolvedValue({
        id: 10,
        email: "john@example.com",
        otp_hash: hashToken("123456"),
        expires_at: new Date(Date.now() + 600000),
        attempts: 1,
      });
      emailVerificationModel.incrementAttempts.mockResolvedValue({ id: 10, attempts: 2 });

      await expect(
        authService.verifyEmail({
          email: "john@example.com",
          otp: "999999",
        })
      ).rejects.toMatchObject({
        statusCode: 400,
      });

      expect(emailVerificationModel.incrementAttempts).toHaveBeenCalledWith(10);
    });

    it("should reject expired OTP", async () => {
      userModel.findByEmail.mockResolvedValue({ id: 1, email: "john@example.com" });
      emailVerificationModel.isEmailVerified.mockResolvedValue(false);
      emailVerificationModel.findLatestActiveCode.mockResolvedValue({
        id: 10,
        email: "john@example.com",
        otp_hash: hashToken("123456"),
        expires_at: new Date(Date.now() - 1000), // Expired
        attempts: 0,
      });

      await expect(
        authService.verifyEmail({
          email: "john@example.com",
          otp: "123456",
        })
      ).rejects.toMatchObject({
        statusCode: 400,
        message: expect.stringContaining("expired"),
      });
    });

    it("should reject when maximum attempts exceeded", async () => {
      userModel.findByEmail.mockResolvedValue({ id: 1, email: "john@example.com" });
      emailVerificationModel.isEmailVerified.mockResolvedValue(false);
      emailVerificationModel.findLatestActiveCode.mockResolvedValue({
        id: 10,
        email: "john@example.com",
        otp_hash: hashToken("123456"),
        expires_at: new Date(Date.now() + 600000),
        attempts: 5,
      });

      await expect(
        authService.verifyEmail({
          email: "john@example.com",
          otp: "123456",
        })
      ).rejects.toMatchObject({
        statusCode: 400,
        message: expect.stringContaining("attempts"),
      });
    });
  });

  describe("resendVerification", () => {
    it("should invalidate old codes and generate new OTP", async () => {
      userModel.findByEmail.mockResolvedValue({ id: 1, email: "john@example.com" });
      emailVerificationModel.isEmailVerified.mockResolvedValue(false);
      emailVerificationModel.invalidateActiveCodes.mockResolvedValue(1);
      emailVerificationModel.createCode.mockResolvedValue({ id: 11 });
      emailService.sendEmailVerificationOtp.mockResolvedValue({ delivered: true });

      const result = await authService.resendVerification("john@example.com");

      expect(emailVerificationModel.invalidateActiveCodes).toHaveBeenCalledWith("john@example.com");
      expect(emailVerificationModel.createCode).toHaveBeenCalled();
      expect(emailService.sendEmailVerificationOtp).toHaveBeenCalled();
      expect(result.message).toContain("verification code has been sent");
    });
  });

  describe("loginUser", () => {
    it("should successfully log in verified user with correct credentials", async () => {
      const passwordHash = await hashPassword("password123");
      userModel.findByEmail.mockResolvedValue({
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        password_hash: passwordHash,
      });
      emailVerificationModel.isEmailVerified.mockResolvedValue(true);

      const result = await authService.loginUser({
        email: "john@example.com",
        password: "password123",
      });

      expect(result).toHaveProperty("user");
      expect(result.user.name).toBe("John Doe");
      expect(result).toHaveProperty("token");
    });

    it("should reject login when user email is not verified", async () => {
      const passwordHash = await hashPassword("password123");
      userModel.findByEmail.mockResolvedValue({
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        password_hash: passwordHash,
      });
      emailVerificationModel.isEmailVerified.mockResolvedValue(false);

      await expect(
        authService.loginUser({
          email: "john@example.com",
          password: "password123",
        })
      ).rejects.toMatchObject({
        statusCode: 403,
        message: expect.stringContaining("verification required"),
      });
    });

    it("should reject login when user is not found", async () => {
      userModel.findByEmail.mockResolvedValue(null);

      await expect(
        authService.loginUser({
          email: "nonexistent@example.com",
          password: "password123",
        })
      ).rejects.toMatchObject({
        statusCode: 401,
        message: "Invalid email or password",
      });
    });

    it("should reject login when password is incorrect", async () => {
      const passwordHash = await hashPassword("correctPassword");
      userModel.findByEmail.mockResolvedValue({
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        password_hash: passwordHash,
      });

      await expect(
        authService.loginUser({
          email: "john@example.com",
          password: "wrongPassword",
        })
      ).rejects.toMatchObject({
        statusCode: 401,
        message: "Invalid email or password",
      });
    });
  });


  describe("requestPasswordReset", () => {
    it("should generate reset token and send email if user exists", async () => {
      userModel.findByEmail.mockResolvedValue({
        id: 1,
        name: "John Doe",
        email: "john@example.com",
      });
      passwordResetTokenModel.invalidateUserTokens.mockResolvedValue(0);
      passwordResetTokenModel.createToken.mockResolvedValue({ id: 10 });
      emailService.sendPasswordResetEmail.mockResolvedValue({ delivered: true });

      const result = await authService.requestPasswordReset("john@example.com");

      expect(passwordResetTokenModel.invalidateUserTokens).toHaveBeenCalledWith(1);
      expect(passwordResetTokenModel.createToken).toHaveBeenCalled();
      expect(emailService.sendPasswordResetEmail).toHaveBeenCalled();
      expect(result.message).toContain("If an account exists");
    });

    it("should return generic message without error even if user does not exist", async () => {
      userModel.findByEmail.mockResolvedValue(null);

      const result = await authService.requestPasswordReset("unknown@example.com");

      expect(passwordResetTokenModel.createToken).not.toHaveBeenCalled();
      expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
      expect(result.message).toContain("If an account exists");
    });
  });

  describe("verifyResetToken", () => {
    it("should return valid: true when valid token is found", async () => {
      passwordResetTokenModel.findValidToken.mockResolvedValue({
        id: 5,
        user_id: 1,
      });

      const result = await authService.verifyResetToken("valid-token");
      expect(result.valid).toBe(true);
    });

    it("should return valid: false when token is not found or expired", async () => {
      passwordResetTokenModel.findValidToken.mockResolvedValue(null);

      const result = await authService.verifyResetToken("invalid-token");
      expect(result.valid).toBe(false);
    });

    it("should return valid: false when empty token is provided", async () => {
      const result = await authService.verifyResetToken("");
      expect(result.valid).toBe(false);
    });
  });

  describe("resetPassword", () => {
    it("should reset password when valid token is provided", async () => {
      passwordResetTokenModel.findValidToken.mockResolvedValue({
        id: 5,
        user_id: 1,
        expires_at: new Date(Date.now() + 3600000),
      });
      userModel.updatePassword.mockResolvedValue(true);
      passwordResetTokenModel.markTokenUsed.mockResolvedValue(true);
      passwordResetTokenModel.invalidateUserTokens.mockResolvedValue(1);

      const result = await authService.resetPassword({
        token: "valid-raw-token",
        newPassword: "newpassword123",
      });

      expect(userModel.updatePassword).toHaveBeenCalledWith(1, expect.any(String));
      expect(passwordResetTokenModel.markTokenUsed).toHaveBeenCalledWith(5);
      expect(result.success).toBe(true);
    });

    it("should reject reset password when token is invalid or expired", async () => {
      passwordResetTokenModel.findValidToken.mockResolvedValue(null);

      await expect(
        authService.resetPassword({
          token: "invalid-token",
          newPassword: "newpassword123",
        })
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "Invalid or expired password reset token",
      });
    });
  });

  describe("getCurrentUser", () => {
    it("should return user details by id", async () => {
      userModel.findById.mockResolvedValue({
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        created_at: new Date(),
        updated_at: new Date(),
      });

      const user = await authService.getCurrentUser(1);
      expect(user.id).toBe(1);
      expect(user.name).toBe("John Doe");
      expect(user.email).toBe("john@example.com");
    });

    it("should throw 404 if user not found", async () => {
      userModel.findById.mockResolvedValue(null);

      await expect(authService.getCurrentUser(999)).rejects.toMatchObject({
        statusCode: 404,
        message: "User not found",
      });
    });
  });
});
