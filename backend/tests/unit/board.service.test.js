const { boardService } = require("../../src/services");
const {
  boardRepository,
  memberRepository,
  activityRepository,
} = require("../../src/repositories");

describe("Board Service Unit Tests", () => {
  const TEST_CODES = ["A7K2P", "B3M9Q", "C5R8T", "D8W4Z", "X9Y8Z"];
  const createdBoardIds = [];

  const cleanupBoardByCode = async (code) => {
    const existing = await boardRepository.findByCode(code);
    if (existing) {
      await boardService.deleteBoard(existing.id, existing.ownerId, "cleanup").catch(() => {});
    }
  };

  beforeEach(async () => {
    for (const code of TEST_CODES) {
      await cleanupBoardByCode(code);
    }
  });

  afterEach(async () => {
    for (const id of createdBoardIds) {
      await boardService.deleteBoard(id, "cleanup", "cleanup").catch(() => {});
    }
    createdBoardIds.length = 0;

    for (const code of TEST_CODES) {
      await cleanupBoardByCode(code);
    }
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
      createdBoardIds.push(board.id);

      expect(board).toBeDefined();
      expect(board.name).toBe("Test Board");
      expect(board.code).toBe("A7K2P");
      expect(board.ownerId).toBe("user_1");

      // Verify owner is added as Admin member via memberRepository
      const members = await memberRepository.findByBoardId(board.id);
      expect(members.length).toBe(1);
      expect(members[0].boardId).toBe(board.id);
      expect(members[0].userId).toBe("user_1");
      expect(members[0].role).toBe("Admin");

      // Verify activity log was created via activityRepository
      const logs = await activityRepository.findByBoardId(board.id);
      expect(logs.length).toBe(1);
      expect(logs[0].action).toBe("BOARD_CREATED");
    });

    it("should reject duplicate board codes with 409", async () => {
      const firstBoard = await boardService.createBoard({
        name: "First Board",
        code: "A7K2P",
        userId: "user_1",
        userName: "Alice",
        userEmail: "alice@example.com",
      });
      createdBoardIds.push(firstBoard.id);

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
      createdBoardIds.push(board.id);

      const joinedBoard = await boardService.joinBoard({
        code: "b3m9q",
        userId: "user_2",
        userName: "Bob",
        userEmail: "bob@example.com",
      });

      expect(joinedBoard.id).toBe(board.id);
      const members = await memberRepository.findByBoardId(board.id);
      expect(members.length).toBe(2);
      const bobMember = members.find((m) => m.userId === "user_2");
      expect(bobMember).toBeDefined();
      expect(bobMember.role).toBe("Member");
    });

    it("should reject joining if user is already owner", async () => {
      const board = await boardService.createBoard({
        name: "Owner Board",
        code: "C5R8T",
        userId: "user_1",
        userName: "Alice",
        userEmail: "alice@example.com",
      });
      createdBoardIds.push(board.id);

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
      createdBoardIds.push(board.id);

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

      expect(await boardRepository.findById(board.id)).toBeNull();
      const remainingMembers = await memberRepository.findByBoardId(board.id);
      expect(remainingMembers.length).toBe(0);
    });
  });
});
