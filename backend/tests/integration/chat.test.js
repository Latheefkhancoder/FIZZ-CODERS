const request = require("supertest");
const app = require("../../src/app");
const { memoryStore } = require("../../src/repositories");
const { generateJwt } = require("../../src/utils/crypto");

describe("Chat Integration Tests", () => {
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
      .send({ name: "Chat Test Board", code: "CHT01" });

    boardId = boardRes.body.data.id;
  });

  describe("POST & GET /api/boards/:boardId/chat", () => {
    it("should send a message and retrieve chat history", async () => {
      const sendRes = await request(app)
        .post(`/api/boards/${boardId}/chat`)
        .set("Authorization", `Bearer ${token}`)
        .send({ text: "Hey team! Let's sync at 3pm." });

      expect(sendRes.status).toBe(201);
      expect(sendRes.body.data.text).toBe("Hey team! Let's sync at 3pm.");
      expect(sendRes.body.data.author).toBe("Alice");

      const getRes = await request(app)
        .get(`/api/boards/${boardId}/chat`)
        .set("Authorization", `Bearer ${token}`);

      expect(getRes.status).toBe(200);
      expect(getRes.body.data.length).toBe(1);
      expect(getRes.body.data[0].text).toBe("Hey team! Let's sync at 3pm.");
    });
  });
});
