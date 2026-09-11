const request = require("supertest");
const app = require("../../src/app");
const { memoryStore, userRepository } = require("../../src/repositories");
const { generateJwt } = require("../../src/utils/crypto");

describe("Profile Integration Tests", () => {
  let token;

  beforeEach(() => {
    memoryStore.clear();

    token = generateJwt({
      id: "usr_alice",
      name: "Alice",
      email: "alice@fizz.com",
      role: "Member",
    });

    jest.spyOn(userRepository, "findById").mockImplementation(async (id) => {
      const stored = memoryStore.userProfiles.get(String(id)) || {};
      return {
        id: String(id),
        name: stored.name || "Alice",
        email: "alice@fizz.com",
        role: "Member",
        bio: stored.bio || "",
      };
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("GET & PATCH /api/profile", () => {
    it("should retrieve authenticated user profile", async () => {
      const res = await request(app)
        .get("/api/profile")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("Alice");
      expect(res.body.data.email).toBe("alice@fizz.com");
      expect(res.body.data.initials).toBe("A");
    });

    it("should update profile bio and name", async () => {
      const res = await request(app)
        .patch("/api/profile")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Alice Wonder",
          bio: "Full stack developer & open source enthusiast",
        });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("Alice Wonder");
      expect(res.body.data.bio).toBe("Full stack developer & open source enthusiast");
      expect(res.body.data.initials).toBe("A");
    });
  });
});
