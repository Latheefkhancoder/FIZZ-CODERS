const request = require("supertest");
const app = require("../../src/app");
const { memoryStore } = require("../../src/repositories");
const { generateJwt } = require("../../src/utils/crypto");

describe("Board Integration Tests", () => {
  let user1Token;
  let user2Token;

  beforeEach(() => {
    memoryStore.clear();

    user1Token = generateJwt({
      id: "usr_1",
      name: "Alice Admin",
      email: "alice@fizz.com",
      role: "Admin",
    });

    user2Token = generateJwt({
      id: "usr_2",
      name: "Bob Member",
      email: "bob@fizz.com",
      role: "Member",
    });
  });

  describe("POST /api/boards", () => {
    it("should require authentication", async () => {
      const res = await request(app).post("/api/boards").send({
        name: "My Board",
        code: "ABC12",
      });
      expect(res.status).toBe(401);
    });

    it("should validate board name and 5-character code", async () => {
      const res = await request(app)
        .post("/api/boards")
        .set("Authorization", `Bearer ${user1Token}`)
        .send({
          name: "",
          code: "TOOLONG123",
        });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });

    it("should create board successfully and normalize code to uppercase", async () => {
      const res = await request(app)
        .post("/api/boards")
        .set("Authorization", `Bearer ${user1Token}`)
        .send({
          name: "Project Titan",
          code: "t1t2n",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe("Project Titan");
      expect(res.body.data.code).toBe("T1T2N");
      expect(res.body.data.ownerId).toBe("usr_1");
    });
  });

  describe("GET /api/boards", () => {
    it("should return empty list when no boards exist", async () => {
      const res = await request(app)
        .get("/api/boards")
        .set("Authorization", `Bearer ${user1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    it("should return only boards the user belongs to or owns", async () => {
      // Alice creates board 1
      await request(app)
        .post("/api/boards")
        .set("Authorization", `Bearer ${user1Token}`)
        .send({ name: "Alice Board", code: "ALC01" });

      // Bob creates board 2
      await request(app)
        .post("/api/boards")
        .set("Authorization", `Bearer ${user2Token}`)
        .send({ name: "Bob Board", code: "BOB01" });

      // Alice fetches boards -> only Alice Board
      const aliceRes = await request(app)
        .get("/api/boards")
        .set("Authorization", `Bearer ${user1Token}`);

      expect(aliceRes.status).toBe(200);
      expect(aliceRes.body.data.length).toBe(1);
      expect(aliceRes.body.data[0].name).toBe("Alice Board");
    });
  });

  describe("GET /api/boards/code/:code & POST /api/boards/join", () => {
    it("should preview board details by code and allow join", async () => {
      await request(app)
        .post("/api/boards")
        .set("Authorization", `Bearer ${user1Token}`)
        .send({ name: "Joinable Board", code: "JOIN1" });

      // Bob previews board
      const previewRes = await request(app)
        .get("/api/boards/code/join1")
        .set("Authorization", `Bearer ${user2Token}`);

      expect(previewRes.status).toBe(200);
      expect(previewRes.body.data.name).toBe("Joinable Board");
      expect(previewRes.body.data.code).toBe("JOIN1");

      // Bob joins board
      const joinRes = await request(app)
        .post("/api/boards/join")
        .set("Authorization", `Bearer ${user2Token}`)
        .send({ code: "join1" });

      expect(joinRes.status).toBe(200);
      expect(joinRes.body.success).toBe(true);

      // Now Bob has access
      const bobBoards = await request(app)
        .get("/api/boards")
        .set("Authorization", `Bearer ${user2Token}`);
      expect(bobBoards.body.data.length).toBe(1);
    });
  });

  describe("GET /api/boards/:boardId & DELETE /api/boards/:boardId", () => {
    it("should deny unauthorized user access to private board", async () => {
      const createRes = await request(app)
        .post("/api/boards")
        .set("Authorization", `Bearer ${user1Token}`)
        .send({ name: "Secret Board", code: "SCR01" });

      const boardId = createRes.body.data.id;

      // Bob tries to access without joining
      const unauthorizedRes = await request(app)
        .get(`/api/boards/${boardId}`)
        .set("Authorization", `Bearer ${user2Token}`);

      expect(unauthorizedRes.status).toBe(403);
    });

    it("should allow board owner to delete board", async () => {
      const createRes = await request(app)
        .post("/api/boards")
        .set("Authorization", `Bearer ${user1Token}`)
        .send({ name: "Delete Me", code: "DEL01" });

      const boardId = createRes.body.data.id;

      const deleteRes = await request(app)
        .delete(`/api/boards/${boardId}`)
        .set("Authorization", `Bearer ${user1Token}`);

      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.success).toBe(true);
    });
  });
});
