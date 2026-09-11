const request = require("supertest");
const app = require("../../src/app");
const { memoryStore } = require("../../src/repositories");
const { generateJwt } = require("../../src/utils/crypto");

describe("Comment Integration Tests", () => {
  let token;
  let taskId;

  beforeEach(async () => {
    memoryStore.clear();

    token = generateJwt({
      id: "usr_alice",
      name: "Alice",
      email: "alice@fizz.com",
      role: "Admin",
    });

    const boardRes = await request(app)
      .post("/api/boards")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Comment Test Board", code: "COM01" });

    const taskRes = await request(app)
      .post(`/api/boards/${boardRes.body.data.id}/tasks`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Task with comments" });

    taskId = taskRes.body.data.id;
  });

  describe("POST & GET /api/tasks/:taskId/comments", () => {
    it("should add a comment and retrieve comments for task", async () => {
      const addRes = await request(app)
        .post(`/api/tasks/${taskId}/comments`)
        .set("Authorization", `Bearer ${token}`)
        .send({ text: "Looking good, remember to test edge cases!" });

      expect(addRes.status).toBe(201);
      expect(addRes.body.data.text).toBe("Looking good, remember to test edge cases!");
      expect(addRes.body.data.author).toBe("Alice");

      const getRes = await request(app)
        .get(`/api/tasks/${taskId}/comments`)
        .set("Authorization", `Bearer ${token}`);

      expect(getRes.status).toBe(200);
      expect(getRes.body.data.length).toBe(1);
      expect(getRes.body.data[0].text).toBe("Looking good, remember to test edge cases!");
    });
  });
});
