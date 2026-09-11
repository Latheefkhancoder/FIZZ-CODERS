const request = require("supertest");
const app = require("../../src/app");
const { memoryStore } = require("../../src/repositories");
const { generateJwt } = require("../../src/utils/crypto");

describe("Activity Log Integration Tests", () => {
  let token;
  let boardId;

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
      .send({ name: "Activity Board", code: "ACT01" });

    boardId = boardRes.body.data.id;
  });

  describe("GET /api/boards/:boardId/activity-logs", () => {
    it("should retrieve activity logs for board actions", async () => {
      // Create a task to generate another log entry
      await request(app)
        .post(`/api/boards/${boardId}/tasks`)
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Task for activity check" });

      const logsRes = await request(app)
        .get(`/api/boards/${boardId}/activity-logs`)
        .set("Authorization", `Bearer ${token}`);

      expect(logsRes.status).toBe(200);
      expect(logsRes.body.success).toBe(true);
      expect(logsRes.body.data.length).toBeGreaterThanOrEqual(2);
      expect(logsRes.body.data[0]).toHaveProperty("who");
      expect(logsRes.body.data[0]).toHaveProperty("what");
      expect(logsRes.body.data[0]).toHaveProperty("when");
    });
  });
});
