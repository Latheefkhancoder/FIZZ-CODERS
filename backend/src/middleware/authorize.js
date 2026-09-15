const { boardRepository, memberRepository, taskRepository } = require("../repositories");
const { errorResponse } = require("../utils/response");

/**
 * Middleware: requireBoardAccess
 * Ensures the authenticated user is the owner, a member, or a system admin of the target board.
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
    const userEmail = req.user?.email ? req.user.email.toLowerCase().trim() : "";
    const isOwner = String(board.ownerId) === userIdStr || (board.ownerEmail && board.ownerEmail.toLowerCase().trim() === userEmail);
    const membership = await memberRepository.findByBoardAndUser(boardId, userIdStr, userEmail);

    const userRole = (req.user?.role || "Admin").toLowerCase();
    const isSystemAdmin = userRole === "admin" || userRole === "developer";

    if (!isOwner && !membership && !isSystemAdmin) {
      return errorResponse(res, "Access denied: You are not a member of this board", null, 403);
    }

    req.board = board;
    req.isOwner = isOwner || isSystemAdmin;
    req.membership = membership;
    req.boardRole = (isOwner || isSystemAdmin) ? "Admin" : (membership?.role || "Member");

    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Middleware: requireBoardAdmin
 * Ensures the authenticated user is the board owner, has role 'Admin' on the board, or is a system admin.
 */
const requireBoardAdmin = async (req, res, next) => {
  try {
    if (!req.board) {
      await new Promise((resolve) => {
        requireBoardAccess(req, res, () => {
          resolve();
        });
      });
    }

    if (res.headersSent) return;

    const userRole = (req.user?.role || "Admin").toLowerCase();
    const isSystemAdmin = userRole === "admin" || userRole === "developer";
    const isBoardAdmin = req.isOwner || (req.boardRole && req.boardRole.toLowerCase() === "admin") || (req.membership?.role && req.membership.role.toLowerCase() === "admin") || isSystemAdmin;

    if (!isBoardAdmin) {
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

