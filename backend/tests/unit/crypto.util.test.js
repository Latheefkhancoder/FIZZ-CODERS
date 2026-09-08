const {
  hashPassword,
  comparePassword,
  generateRandomToken,
  hashToken,
  generateJwt,
  verifyJwt,
} = require("../../src/utils/crypto");

describe("Crypto Utils Unit Tests", () => {
  it("should hash a password and verify it correctly", async () => {
    const password = "mySecretPassword123";
    const hash = await hashPassword(password);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);

    const isMatch = await comparePassword(password, hash);
    expect(isMatch).toBe(true);

    const isWrongMatch = await comparePassword("wrongPassword", hash);
    expect(isWrongMatch).toBe(false);
  });

  it("should generate random hex tokens of correct length", () => {
    const token = generateRandomToken(32);
    expect(typeof token).toBe("string");
    expect(token).toHaveLength(64); // 32 bytes = 64 hex characters
  });

  it("should hash tokens deterministically", () => {
    const token = "known-random-token-12345";
    const hash1 = hashToken(token);
    const hash2 = hashToken(token);

    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64); // SHA-256 = 64 hex characters
  });

  it("should generate and verify valid JWT tokens", () => {
    const payload = { id: 1, email: "john@example.com", name: "John Doe" };
    const token = generateJwt(payload);

    expect(typeof token).toBe("string");

    const decoded = verifyJwt(token);
    expect(decoded.id).toBe(payload.id);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.name).toBe(payload.name);
  });

  it("should throw error when verifying invalid JWT", () => {
    expect(() => {
      verifyJwt("invalid.jwt.token");
    }).toThrow();
  });
});
