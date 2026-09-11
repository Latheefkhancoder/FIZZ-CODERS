const { boardRepository, memberRepository, taskRepository } = require("../repositories");
const { errorResponse } = require("../utils/response");

/**
 * Middleware: requireBoardAccess
 * Ensures the authenticated user is the owner or a member of the target board.
 * Extracts boardId from req.params.boardId, req.body.boardId, or resolves from req.params.taskId.
 */
const requireBoardAccess = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return errorResponse(res, "Authentication required", null, 401);
    }

    let boardId = req.params.boardId || req.body?.boardId;

    // If route has :taskId, resolve task's boardId
    if (!boardId && req.params.taskId) {
      const task = await taskRepository.findById(req.params.taskId);
      if (!task) {
        return errorResponse(res, "Task not found", null, 404);
      }
      boardId = task.boardId;
      req.task = task;
    }

    if (!boardId) {
      return errorResponse(res, "Board identifier missing from request", null, 400);
    }

    const board = await boardRepository.findById(boardId);
    if (!board) {
      return errorResponse(res, "Board not found", null, 404);
    }

    const userIdStr = String(userId);
    const isOwner = String(board.ownerId) === userIdStr;
    const membership = await memberRepository.findByBoardAndUser(boardId, userIdStr);

    if (!isOwner && !membership) {
      return errorResponse(res, "Access denied: You are not a member of this board", null, 403);
    }

    req.board = board;
    req.isOwner = isOwner;
    req.membership = membership;
    req.boardRole = isOwner ? "Admin" : (membership?.role || "Member");

    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Middleware: requireBoardAdmin
 * Ensures the authenticated user is the board owner or has role 'Admin'.
 */
const requireBoardAdmin = async (req, res, next) => {
  try {
    // If requireBoardAccess hasn't run yet, run it
    if (!req.board) {
      return requireBoardAccess(req, res, () => {
        if (!req.isOwner && req.boardRole !== "Admin") {
          return errorResponse(res, "Forbidden: Administrator privileges required for this board", null, 403);
        }
        next();
      });
    }

    if (!req.isOwner && req.boardRole !== "Admin") {
      return errorResponse(res, "Forbidden: Administrator privileges required for this board", null, 403);
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  requireBoardAccess,
  requireBoardAdmin,
};
