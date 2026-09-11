const { taskService, boardService } = require("../../src/services");
const { memoryStore, memberRepository } = require("../../src/repositories");

describe("Task Service Unit Tests", () => {
  let board;

  beforeEach(async () => {
    memoryStore.clear();
    board = await boardService.createBoard({
      name: "Sprint Board",
      code: "SPNT1",
      userId: "user_owner",
      userName: "Owner",
      userEmail: "owner@fizz.com",
    });

    // Add another member
    await memberRepository.create({
      boardId: board.id,
      userId: "user_member",
      name: "Member User",
      email: "member@fizz.com",
      role: "Member",
    });
  });

  describe("createTask", () => {
    it("should create a task with default TODO status", async () => {
      const task = await taskService.createTask({
        boardId: board.id,
        title: "Build Navbar",
        description: "Responsive navigation bar",
        priority: "HIGH",
        creatorId: "user_owner",
        creatorName: "Owner",
      });

      expect(task).toBeDefined();
      expect(task.title).toBe("Build Navbar");
      expect(task.status).toBe("TODO");
      expect(task.priority).toBe("HIGH");
      expect(task.boardId).toBe(board.id);
    });

    it("should reject assignment to a non-member", async () => {
      await expect(
        taskService.createTask({
          boardId: board.id,
          title: "Setup Auth",
          assignee: "stranger_user",
          creatorId: "user_owner",
          creatorName: "Owner",
        })
      ).rejects.toThrow("Assignee must be an active member");
    });

    it("should allow assignment to a valid board member", async () => {
      const task = await taskService.createTask({
        boardId: board.id,
        title: "Setup Database",
        assignee: "user_member",
        creatorId: "user_owner",
        creatorName: "Owner",
      });

      expect(task.assignee).toBe("user_member");
    });
  });

  describe("updateTaskStatus", () => {
    it("should update status and normalize IN PROGRESS to IN_PROGRESS", async () => {
      const task = await taskService.createTask({
        boardId: board.id,
        title: "Deploy app",
        creatorId: "user_owner",
        creatorName: "Owner",
      });

      const updated = await taskService.updateTaskStatus(
        task.id,
        "IN PROGRESS",
        "user_owner",
        "Owner"
      );

      expect(updated.status).toBe("IN_PROGRESS");
    });
  });

  describe("deleteTask", () => {
    it("should delete task and its comments", async () => {
      const task = await taskService.createTask({
        boardId: board.id,
        title: "Task to delete",
        creatorId: "user_owner",
        creatorName: "Owner",
      });

      await taskService.deleteTask(task.id, "user_owner", "Owner");

      const found = await taskService.getBoardTasks(board.id);
      expect(found.length).toBe(0);
    });
  });
});
