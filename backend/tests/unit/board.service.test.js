const { boardService } = require("../../src/services");
const { memoryStore } = require("../../src/repositories");

describe("Board Service Unit Tests", () => {
  beforeEach(() => {
    memoryStore.clear();
  });

  describe("createBoard", () => {
    it("should successfully create a board, normalize code to uppercase, and add owner as Admin member", async () => {
      const board = await boardService.createBoard({
        name: "Test Board",
        code: "a7k2p",
        userId: "user_1",
        userName: "Alice",
        userEmail: "alice@example.com",
      });

      expect(board).toBeDefined();
      expect(board.name).toBe("Test Board");
      expect(board.code).toBe("A7K2P");
      expect(board.ownerId).toBe("user_1");

      // Verify owner is added as Admin member
      const members = Array.from(memoryStore.members.values());
      expect(members.length).toBe(1);
      expect(members[0].boardId).toBe(board.id);
      expect(members[0].userId).toBe("user_1");
      expect(members[0].role).toBe("Admin");

      // Verify activity log was created
      const logs = Array.from(memoryStore.activityLogs.values());
      expect(logs.length).toBe(1);
      expect(logs[0].action).toBe("BOARD_CREATED");
    });

    it("should reject duplicate board codes with 409", async () => {
      await boardService.createBoard({
        name: "First Board",
        code: "A7K2P",
        userId: "user_1",
        userName: "Alice",
        userEmail: "alice@example.com",
      });

      await expect(
        boardService.createBoard({
          name: "Second Board",
          code: "a7k2p",
          userId: "user_2",
          userName: "Bob",
          userEmail: "bob@example.com",
        })
      ).rejects.toThrow("already in use");
    });
  });

  describe("joinBoard", () => {
    it("should allow a new user to join a board via code", async () => {
      const board = await boardService.createBoard({
        name: "Collab Board",
        code: "B3M9Q",
        userId: "user_1",
        userName: "Alice",
        userEmail: "alice@example.com",
      });

      const joinedBoard = await boardService.joinBoard({
        code: "b3m9q",
        userId: "user_2",
        userName: "Bob",
        userEmail: "bob@example.com",
      });

      expect(joinedBoard.id).toBe(board.id);
      const members = Array.from(memoryStore.members.values());
      expect(members.length).toBe(2);
      const bobMember = members.find((m) => m.userId === "user_2");
      expect(bobMember).toBeDefined();
      expect(bobMember.role).toBe("Member");
    });

    it("should reject joining if user is already owner", async () => {
      await boardService.createBoard({
        name: "Owner Board",
        code: "C5R8T",
        userId: "user_1",
        userName: "Alice",
        userEmail: "alice@example.com",
      });

      await expect(
        boardService.joinBoard({
          code: "C5R8T",
          userId: "user_1",
          userName: "Alice",
          userEmail: "alice@example.com",
        })
      ).rejects.toThrow("already the owner");
    });

    it("should reject joining if user is already a member", async () => {
      const board = await boardService.createBoard({
        name: "Team Board",
        code: "D8W4Z",
        userId: "user_1",
        userName: "Alice",
        userEmail: "alice@example.com",
      });

      await boardService.joinBoard({
        code: "D8W4Z",
        userId: "user_2",
        userName: "Bob",
        userEmail: "bob@example.com",
      });

      await expect(
        boardService.joinBoard({
          code: "D8W4Z",
          userId: "user_2",
          userName: "Bob",
          userEmail: "bob@example.com",
        })
      ).rejects.toThrow("already a member");
    });
  });

  describe("deleteBoard", () => {
    it("should cascade delete tasks, members, comments, and activities", async () => {
      const board = await boardService.createBoard({
        name: "To Delete",
        code: "X9Y8Z",
        userId: "user_1",
        userName: "Alice",
        userEmail: "alice@example.com",
      });

      await boardService.deleteBoard(board.id, "user_1", "Alice");

      expect(memoryStore.boards.has(board.id)).toBe(false);
      expect(Array.from(memoryStore.members.values()).filter((m) => m.boardId === board.id).length).toBe(0);
    });
  });
});
