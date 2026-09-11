const request = require("supertest");
const app = require("../../src/app");
const { memoryStore, userRepository } = require("../../src/repositories");
const { generateJwt } = require("../../src/utils/crypto");

describe("Member Integration Tests", () => {
  let adminToken;
  let boardId;

  beforeEach(async () => {
    memoryStore.clear();

    adminToken = generateJwt({
      id: "admin_1",
      name: "Admin Alice",
      email: "admin@fizz.com",
      role: "Admin",
    });

    const boardRes = await request(app)
      .post("/api/boards")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Team Board", code: "MEM01" });

    boardId = boardRes.body.data.id;

    // Mock existing user in userRepository
    jest.spyOn(userRepository, "findByEmail").mockImplementation(async (email) => {
      if (email === "newmember@fizz.com") {
        return {
          id: "member_bob",
          name: "Bob",
          email: "newmember@fizz.com",
        };
      }
      return null;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Member Management", () => {
    it("should list board members including the creator", async () => {
      const res = await request(app)
        .get(`/api/boards/${boardId}/members`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].name).toBe("Admin Alice");
      expect(res.body.data[0].role).toBe("Admin");
    });

    it("should add a registered member to the board", async () => {
      const res = await request(app)
        .post(`/api/boards/${boardId}/members`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          email: "newmember@fizz.com",
          role: "Member",
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe("Bob");
      expect(res.body.data.role).toBe("Member");
    });

    it("should update role of a member", async () => {
      await request(app)
        .post(`/api/boards/${boardId}/members`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          email: "newmember@fizz.com",
          role: "Member",
        });

      const updateRes = await request(app)
        .patch(`/api/boards/${boardId}/members/member_bob`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ role: "Admin" });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.data.role).toBe("Admin");
    });

    it("should remove member from board", async () => {
      await request(app)
        .post(`/api/boards/${boardId}/members`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          email: "newmember@fizz.com",
          role: "Member",
        });

      const delRes = await request(app)
        .delete(`/api/boards/${boardId}/members/member_bob`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(delRes.status).toBe(200);
    });
  });
});
