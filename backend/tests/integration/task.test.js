const request = require("supertest");
const app = require("../../src/app");
const { memoryStore } = require("../../src/repositories");
const { generateJwt } = require("../../src/utils/crypto");

describe("Task Integration Tests", () => {
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
      .send({ name: "Task Testing Board", code: "TSK01" });

    boardId = boardRes.body.data.id;
  });

  describe("Task Lifecycle", () => {
    it("should create, read, update, move, and delete tasks", async () => {
      // 1. Create task
      const createRes = await request(app)
        .post(`/api/boards/${boardId}/tasks`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Setup CI Pipeline",
          description: "Configure GitHub Actions",
          priority: "HIGH",
          dueDate: "2026-10-01",
        });

      expect(createRes.status).toBe(201);
      expect(createRes.body.success).toBe(true);
      const taskId = createRes.body.data.id;
      expect(createRes.body.data.title).toBe("Setup CI Pipeline");
      expect(createRes.body.data.status).toBe("TODO");

      // 2. Read board tasks
      const listRes = await request(app)
        .get(`/api/boards/${boardId}/tasks`)
        .set("Authorization", `Bearer ${token}`);

      expect(listRes.status).toBe(200);
      expect(listRes.body.data.length).toBe(1);

      // 3. Read specific task
      const getRes = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(getRes.status).toBe(200);
      expect(getRes.body.data.id).toBe(taskId);

      // 4. Update task details
      const updateRes = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Setup CI/CD Pipeline",
          priority: "URGENT",
        });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.data.title).toBe("Setup CI/CD Pipeline");
      expect(updateRes.body.data.priority).toBe("URGENT");

      // 5. Update task status (move task)
      const moveRes = await request(app)
        .patch(`/api/tasks/${taskId}/status`)
        .set("Authorization", `Bearer ${token}`)
        .send({ status: "IN_PROGRESS" });

      expect(moveRes.status).toBe(200);
      expect(moveRes.body.data.status).toBe("IN_PROGRESS");

      // 6. Delete task
      const delRes = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(delRes.status).toBe(200);

      // Verify deletion
      const checkRes = await request(app)
        .get(`/api/boards/${boardId}/tasks`)
        .set("Authorization", `Bearer ${token}`);
      expect(checkRes.body.data.length).toBe(0);
    });

    it("should return assigned tasks under /api/tasks/my", async () => {
      // Create task assigned to Alice
      await request(app)
        .post(`/api/boards/${boardId}/tasks`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "My assigned task",
          assignee: "usr_alice",
        });

      const myRes = await request(app)
        .get("/api/tasks/my")
        .set("Authorization", `Bearer ${token}`);

      expect(myRes.status).toBe(200);
      expect(myRes.body.data.length).toBe(1);
      expect(myRes.body.data[0].title).toBe("My assigned task");
    });
  });
});
