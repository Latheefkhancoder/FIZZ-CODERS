const { authService } = require("../../src/services");
const { userModel, passwordResetTokenModel } = require("../../src/models");
const emailService = require("../../src/services/email.service");
const { hashPassword } = require("../../src/utils/crypto");

jest.mock("../../src/models/user.model");
jest.mock("../../src/models/passwordResetToken.model");
jest.mock("../../src/services/email.service");

describe("Auth Service Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should successfully register a new user", async () => {
      userModel.findByEmail.mockResolvedValue(null);
      userModel.createUser.mockResolvedValue({
        id: 1,
        name: "John Doe",
        email: "john@example.com",
      });

      const result = await authService.registerUser({
        fullName: "John Doe",
        email: "john@example.com",
        password: "password123",
      });

      expect(userModel.findByEmail).toHaveBeenCalledWith("john@example.com");
      expect(userModel.createUser).toHaveBeenCalled();
      expect(result).toHaveProperty("user");
      expect(result.user.email).toBe("john@example.com");
      expect(result).toHaveProperty("token");
    });

    it("should throw 409 conflict if email already exists", async () => {
      userModel.findByEmail.mockResolvedValue({ id: 1, email: "john@example.com" });

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

  describe("loginUser", () => {
    it("should successfully log in user with correct credentials", async () => {
      const passwordHash = await hashPassword("password123");
      userModel.findByEmail.mockResolvedValue({
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        password_hash: passwordHash,
      });

      const result = await authService.loginUser({
        email: "john@example.com",
        password: "password123",
      });

      expect(result).toHaveProperty("user");
      expect(result.user.name).toBe("John Doe");
      expect(result).toHaveProperty("token");
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
