const { boardService } = require("../services");
const { successResponse } = require("../utils/response");

/**
 * Board Controller
 * Thin controller dispatching board operations to boardService.
 */

const createBoard = async (req, res, next) => {
  try {
    const { name, code } = req.body;
    const board = await boardService.createBoard({
      name,
      code,
      userId: req.user.id,
      userName: req.user.name || "User",
      userEmail: req.user.email,
    });
    return successResponse(res, "Board created successfully", board, 201);
  } catch (err) {
    next(err);
  }
};

const getUserBoards = async (req, res, next) => {
  try {
    const boards = await boardService.getUserBoards(req.user.id);
    return successResponse(res, "Boards retrieved successfully", boards, 200);
  } catch (err) {
    next(err);
  }
};

const getBoardById = async (req, res, next) => {
  try {
    const board = await boardService.getBoardById(req.params.boardId);
    return successResponse(res, "Board retrieved successfully", board, 200);
  } catch (err) {
    next(err);
  }
};

const getBoardByCode = async (req, res, next) => {
  try {
    const board = await boardService.getBoardByCode(req.params.code);
    return successResponse(res, "Board details retrieved successfully", board, 200);
  } catch (err) {
    next(err);
  }
};

const joinBoard = async (req, res, next) => {
  try {
    const { code } = req.body;
    const board = await boardService.joinBoard({
      code,
      userId: req.user.id,
      userName: req.user.name || "User",
      userEmail: req.user.email,
    });
    return successResponse(res, "Joined board successfully", board, 200);
  } catch (err) {
    next(err);
  }
};

const deleteBoard = async (req, res, next) => {
  try {
    await boardService.deleteBoard(req.params.boardId, req.user.id, req.user.name);
    return successResponse(res, "Board deleted successfully", null, 200);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBoard,
  getUserBoards,
  getBoardById,
  getBoardByCode,
  joinBoard,
  deleteBoard,
};
