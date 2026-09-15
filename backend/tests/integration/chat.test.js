const request = require("supertest");
const app = require("../../src/app");
const { boardRepository } = require("../../src/repositories");
const { boardService } = require("../../src/services");
const { generateJwt } = require("../../src/utils/crypto");

describe("Chat Integration Tests", () => {
  let token;
  let boardId;

  const cleanupBoardByCode = async (code) => {
    const existing = await boardRepository.findByCode(code);
    if (existing) {
      await boardService.deleteBoard(existing.id, existing.ownerId, "cleanup").catch(() => {});
    }
  };

  beforeEach(async () => {
    await cleanupBoardByCode("CHT01");

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

  afterEach(async () => {
    if (boardId) {
      await boardService.deleteBoard(boardId, "usr_alice", "Alice").catch(() => {});
    }
    await cleanupBoardByCode("CHT01");
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
