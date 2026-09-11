const { memberService, boardService } = require("../../src/services");
const { memoryStore, userRepository } = require("../../src/repositories");

describe("Member Service Unit Tests", () => {
  let board;

  beforeEach(async () => {
    memoryStore.clear();
    board = await boardService.createBoard({
      name: "Org Board",
      code: "ORG01",
      userId: "user_owner",
      userName: "Board Owner",
      userEmail: "owner@fizz.com",
    });

    // Mock userRepository for finding users
    jest.spyOn(userRepository, "findByEmail").mockImplementation(async (email) => {
      if (email === "registered@fizz.com") {
        return {
          id: "user_registered",
          name: "Registered User",
          email: "registered@fizz.com",
        };
      }
      return null;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("addMember", () => {
    it("should add a registered user as a member to the board", async () => {
      const member = await memberService.addMember({
        boardId: board.id,
        email: "registered@fizz.com",
        role: "Member",
        actorUserId: "user_owner",
        actorName: "Board Owner",
      });

      expect(member).toBeDefined();
      expect(member.name).toBe("Registered User");
      expect(member.email).toBe("registered@fizz.com");
      expect(member.role).toBe("Member");
    });

    it("should reject adding unregistered user", async () => {
      await expect(
        memberService.addMember({
          boardId: board.id,
          email: "ghost@fizz.com",
          role: "Member",
          actorUserId: "user_owner",
          actorName: "Board Owner",
        })
      ).rejects.toThrow("does not exist");
    });

    it("should reject adding existing member twice", async () => {
      await memberService.addMember({
        boardId: board.id,
        email: "registered@fizz.com",
        role: "Member",
        actorUserId: "user_owner",
        actorName: "Board Owner",
      });

      await expect(
        memberService.addMember({
          boardId: board.id,
          email: "registered@fizz.com",
          role: "Member",
          actorUserId: "user_owner",
          actorName: "Board Owner",
        })
      ).rejects.toThrow("already a member");
    });
  });

  describe("updateMemberRole", () => {
    it("should update role of an existing member", async () => {
      await memberService.addMember({
        boardId: board.id,
        email: "registered@fizz.com",
        role: "Member",
        actorUserId: "user_owner",
        actorName: "Board Owner",
      });

      const updated = await memberService.updateMemberRole({
        boardId: board.id,
        targetUserId: "user_registered",
        newRole: "Admin",
        actorUserId: "user_owner",
        actorName: "Board Owner",
      });

      expect(updated.role).toBe("Admin");
    });

    it("should prevent altering the role of the board owner", async () => {
      await expect(
        memberService.updateMemberRole({
          boardId: board.id,
          targetUserId: "user_owner",
          newRole: "Member",
          actorUserId: "user_owner",
          actorName: "Board Owner",
        })
      ).rejects.toThrow("Cannot alter the role of the board owner");
    });
  });

  describe("removeMember", () => {
    it("should prevent removing the board owner", async () => {
      await expect(
        memberService.removeMember({
          boardId: board.id,
          targetUserId: "user_owner",
          actorUserId: "user_owner",
          actorName: "Board Owner",
        })
      ).rejects.toThrow("Cannot remove the owner");
    });
  });
});
