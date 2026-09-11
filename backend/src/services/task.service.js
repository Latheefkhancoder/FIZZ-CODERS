const {
  taskRepository,
  boardRepository,
  memberRepository,
  commentRepository,
  userRepository,
} = require("../repositories");
const activityService = require("./activity.service");

/**
 * Task Service
 * Handles task CRUD, assignment verification, status transitions, and activity logging.
 */
class TaskService {
  /**
   * Create a new task within a board
   * @param {object} params
   * @returns {Promise<object>}
   */
  async createTask({
    boardId,
    title,
    description,
    priority = "MEDIUM",
    assignee = null,
    dueDate = null,
    creatorId,
    creatorName,
  }) {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      const error = new Error("Board not found");
      error.statusCode = 404;
      throw error;
    }

    let assigneeName = null;
    let validatedAssigneeId = null;

    // Verify assignee belongs to board if specified
    if (assignee) {
      const assigneeStr = String(assignee);
      // Check if assignee is the board owner
      if (String(board.ownerId) === assigneeStr) {
        validatedAssigneeId = assigneeStr;
        const ownerUser = await userRepository.findById(board.ownerId);
        assigneeName = ownerUser?.name || "Board Owner";
      } else {
        // Check if assignee is a member of this board by userId or memberId
        const member =
          (await memberRepository.findByBoardAndUser(boardId, assigneeStr)) ||
          (await memberRepository.findById(assigneeStr));

        if (!member || String(member.boardId) !== String(boardId)) {
          const error = new Error("Assignee must be an active member of this board");
          error.statusCode = 400;
          throw error;
        }

        validatedAssigneeId = member.userId || member.id;
        assigneeName = member.name;
      }
    }

    const task = await taskRepository.create({
      boardId,
      title,
      description,
      priority,
      status: "TODO",
      creatorId,
      creatorName,
      assignee: validatedAssigneeId,
      dueDate,
    });

    // Record creation activity
    await activityService.logAction({
      boardId,
      userId: creatorId,
      who: creatorName,
      what: `created task "${task.title}"`,
      action: "TASK_CREATED",
      description: `created task "${task.title}"`,
    });

    // Record assignment activity if assigned
    if (validatedAssigneeId && assigneeName) {
      await activityService.logAction({
        boardId,
        userId: creatorId,
        who: creatorName,
        what: `assigned "${task.title}" to ${assigneeName}`,
        action: "TASK_ASSIGNED",
        description: `assigned "${task.title}" to ${assigneeName}`,
      });
    }

    return task;
  }

  /**
   * Get all tasks for a board with optional query filters
   * @param {string} boardId
   * @param {object} [filters]
   * @returns {Promise<Array<object>>}
   */
  async getBoardTasks(boardId, filters = {}) {
    const tasks = await taskRepository.findByBoardId(boardId, filters);

    // Populate comments for each task
    const enrichedTasks = await Promise.all(
      tasks.map(async (t) => {
        const comments = await commentRepository.findByTaskId(t.id);
        return { ...t, comments };
      })
    );

    return enrichedTasks;
  }

  /**
   * Get tasks assigned to a specific user across accessible boards
   * @param {string} userId
   * @returns {Promise<Array<object>>}
   */
  async getMyTasks(userId) {
    const accessibleBoardIds = await memberRepository.findUserBoardIds(userId);
    // Include boards user owns
    const allBoards = await boardRepository.findAll();
    for (const b of allBoards) {
      if (String(b.ownerId) === String(userId)) {
        accessibleBoardIds.add(b.id);
      }
    }

    const tasks = await taskRepository.findByAssigneeId(userId, accessibleBoardIds);
    return Promise.all(
      tasks.map(async (t) => {
        const comments = await commentRepository.findByTaskId(t.id);
        return { ...t, comments };
      })
    );
  }

  /**
   * Get task details by ID with comments
   * @param {string} taskId
   * @returns {Promise<object>}
   */
  async getTaskById(taskId) {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    const comments = await commentRepository.findByTaskId(taskId);
    return { ...task, comments };
  }

  /**
   * Update task details
   * @param {string} taskId
   * @param {object} updates
   * @param {string} actorUserId
   * @param {string} actorName
   * @returns {Promise<object>}
   */
  async updateTask(taskId, updates, actorUserId, actorName) {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    // If updating assignee, verify assignee is on the board
    let validatedAssigneeId = undefined;
    let assigneeName = null;

    if (updates.assignee !== undefined) {
      if (updates.assignee === null || updates.assignee === "") {
        validatedAssigneeId = null;
      } else {
        const assigneeStr = String(updates.assignee);
        const board = await boardRepository.findById(task.boardId);

        if (board && String(board.ownerId) === assigneeStr) {
          validatedAssigneeId = assigneeStr;
          const ownerUser = await userRepository.findById(board.ownerId);
          assigneeName = ownerUser?.name || "Board Owner";
        } else {
          const member =
            (await memberRepository.findByBoardAndUser(task.boardId, assigneeStr)) ||
            (await memberRepository.findById(assigneeStr));

          if (!member || String(member.boardId) !== String(task.boardId)) {
            const error = new Error("Assignee must be an active member of this board");
            error.statusCode = 400;
            throw error;
          }

          validatedAssigneeId = member.userId || member.id;
          assigneeName = member.name;
        }
      }
    }

    const patch = { ...updates };
    if (validatedAssigneeId !== undefined) {
      patch.assignee = validatedAssigneeId;
    }

    const updated = await taskRepository.update(taskId, patch);

    // Record activity log
    await activityService.logAction({
      boardId: task.boardId,
      userId: actorUserId,
      who: actorName,
      what: `updated task "${updated.title}"`,
      action: "TASK_UPDATED",
      description: `updated task "${updated.title}"`,
    });

    if (validatedAssigneeId && assigneeName) {
      await activityService.logAction({
        boardId: task.boardId,
        userId: actorUserId,
        who: actorName,
        what: `assigned "${updated.title}" to ${assigneeName}`,
        action: "TASK_ASSIGNED",
        description: `assigned "${updated.title}" to ${assigneeName}`,
      });
    }

    const comments = await commentRepository.findByTaskId(taskId);
    return { ...updated, comments };
  }

  /**
   * Update task status (move task)
   * @param {string} taskId
   * @param {string} status - TODO, IN_PROGRESS, or DONE
   * @param {string} actorUserId
   * @param {string} actorName
   * @returns {Promise<object>}
   */
  async updateTaskStatus(taskId, status, actorUserId, actorName) {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    const normalizedStatus = status.toUpperCase().replace(/\s+/g, "_");
    const updated = await taskRepository.update(taskId, { status: normalizedStatus });

    const displayStatus = normalizedStatus.replace("_", " ");
    await activityService.logAction({
      boardId: task.boardId,
      userId: actorUserId,
      who: actorName,
      what: `moved "${task.title}" to ${displayStatus}`,
      action: "TASK_STATUS_CHANGED",
      description: `moved "${task.title}" to ${displayStatus}`,
    });

    const comments = await commentRepository.findByTaskId(taskId);
    return { ...updated, comments };
  }

  /**
   * Delete task and its comments
   * @param {string} taskId
   * @param {string} actorUserId
   * @param {string} actorName
   * @returns {Promise<boolean>}
   */
  async deleteTask(taskId, actorUserId, actorName) {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    await commentRepository.deleteByTaskId(taskId);
    await taskRepository.delete(taskId);

    await activityService.logAction({
      boardId: task.boardId,
      userId: actorUserId,
      who: actorName,
      what: `deleted task "${task.title}"`,
      action: "TASK_DELETED",
      description: `deleted task "${task.title}"`,
    });

    return true;
  }
}

module.exports = new TaskService();
