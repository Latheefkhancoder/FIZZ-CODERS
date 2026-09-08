const request = require("supertest");
const app = require("../../src/app");
const { userModel, passwordResetTokenModel } = require("../../src/models");
const emailService = require("../../src/services/email.service");
const { hashPassword, generateJwt } = require("../../src/utils/crypto");

jest.mock("../../src/models/user.model");
jest.mock("../../src/models/passwordResetToken.model");
jest.mock("../../src/services/email.service");

describe("Auth Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/register", () => {
    it("should successfully register and return 201 with user and token", async () => {
      userModel.findByEmail.mockResolvedValue(null);
      userModel.createUser.mockResolvedValue({
        id: 1,
        name: "Jane Doe",
        email: "jane@example.com",
      });

      const response = await request(app)
        .post("/api/auth/register")
        .send({
          fullName: "Jane Doe",
          email: "jane@example.com",
          password: "password123",
          confirmPassword: "password123",
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data.user.email).toBe("jane@example.com");
      expect(response.body.data.user).not.toHaveProperty("password_hash");
    });

    it("should return 400 when validation fails", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          fullName: "Jane Doe",
          email: "jane@example.com",
          password: "password123",
          confirmPassword: "differentPassword",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Passwords do not match");
    });

    it("should return 409 when email already exists", async () => {
      userModel.findByEmail.mockResolvedValue({ id: 1, email: "jane@example.com" });

      const response = await request(app)
        .post("/api/auth/register")
        .send({
          fullName: "Jane Doe",
          email: "jane@example.com",
          password: "password123",
          confirmPassword: "password123",
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("already exists");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should successfully login and return 200 with JWT token", async () => {
      const passwordHash = await hashPassword("password123");
      userModel.findByEmail.mockResolvedValue({
        id: 1,
        name: "Jane Doe",
        email: "jane@example.com",
        password_hash: passwordHash,
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "jane@example.com",
          password: "password123",
          rememberMe: true,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data.user.name).toBe("Jane Doe");
      expect(response.body.data.user).not.toHaveProperty("password_hash");
    });

    it("should return 401 when password is wrong", async () => {
      const passwordHash = await hashPassword("correctPass");
      userModel.findByEmail.mockResolvedValue({
        id: 1,
        name: "Jane Doe",
        email: "jane@example.com",
        password_hash: passwordHash,
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "jane@example.com",
          password: "wrongPassword",
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/forgot-password", () => {
    it("should return 200 with generic message for valid email", async () => {
      userModel.findByEmail.mockResolvedValue({
        id: 1,
        name: "Jane Doe",
        email: "jane@example.com",
      });
      passwordResetTokenModel.invalidateUserTokens.mockResolvedValue(0);
      passwordResetTokenModel.createToken.mockResolvedValue({ id: 10 });
      emailService.sendPasswordResetEmail.mockResolvedValue({ delivered: true });

      const response = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: "jane@example.com" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("If an account exists");
    });

    it("should return 400 for invalid email format", async () => {
      const response = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: "invalid-email" });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/reset-password", () => {
    it("should return 200 when reset token is valid", async () => {
      passwordResetTokenModel.findValidToken.mockResolvedValue({
        id: 5,
        user_id: 1,
        expires_at: new Date(Date.now() + 3600000),
      });
      userModel.updatePassword.mockResolvedValue(true);
      passwordResetTokenModel.markTokenUsed.mockResolvedValue(true);
      passwordResetTokenModel.invalidateUserTokens.mockResolvedValue(0);

      const response = await request(app)
        .post("/api/auth/reset-password")
        .send({
          token: "valid-reset-token",
          newPassword: "newpassword123",
          confirmPassword: "newpassword123",
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("successfully reset");
    });

    it("should return 400 when reset token is invalid or expired", async () => {
      passwordResetTokenModel.findValidToken.mockResolvedValue(null);

      const response = await request(app)
        .post("/api/auth/reset-password")
        .send({
          token: "expired-or-fake-token",
          newPassword: "newpassword123",
          confirmPassword: "newpassword123",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return 401 when Authorization header is missing", async () => {
      const response = await request(app).get("/api/auth/me");
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it("should return 401 when token is invalid", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it("should return 200 and user profile when token is valid", async () => {
      const validToken = generateJwt({ id: 1, email: "jane@example.com", name: "Jane Doe" });
      userModel.findById.mockResolvedValue({
        id: 1,
        name: "Jane Doe",
        email: "jane@example.com",
        created_at: new Date(),
        updated_at: new Date(),
      });

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe("jane@example.com");
    });
  });
});
