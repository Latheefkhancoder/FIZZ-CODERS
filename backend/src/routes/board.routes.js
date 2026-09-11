const express = require("express");
const { boardController, taskController } = require("../controllers");
const {
  authenticate,
  requireBoardAccess,
  requireBoardAdmin,
  validate,
} = require("../middleware");
const {
  validateCreateBoard,
  validateJoinBoard,
  validateCreateTask,
} = require("../validators");

const memberRoutes = require("./member.routes");
const activityRoutes = require("./activity.routes");
const chatRoutes = require("./chat.routes");

const router = express.Router();

router.use(authenticate);

// Sub-routers for nested board resources
router.use("/:boardId/members", memberRoutes);
router.use("/:boardId/activity-logs", activityRoutes);
router.use("/:boardId/chat", chatRoutes);

// Board-scoped tasks: POST /api/boards/:boardId/tasks & GET /api/boards/:boardId/tasks
router.post(
  "/:boardId/tasks",
  requireBoardAccess,
  validate(validateCreateTask),
  taskController.createTask
);
router.get("/:boardId/tasks", requireBoardAccess, taskController.getBoardTasks);

// POST /api/boards - Create new board
router.post("/", validate(validateCreateBoard), boardController.createBoard);

// GET /api/boards - List user boards
router.get("/", boardController.getUserBoards);

// POST /api/boards/join - Join board via 5-char code
router.post("/join", validate(validateJoinBoard), boardController.joinBoard);

// GET /api/boards/code/:code - Lookup board preview by code
router.get("/code/:code", boardController.getBoardByCode);

// GET /api/boards/:boardId - Get board details
router.get("/:boardId", requireBoardAccess, boardController.getBoardById);

// DELETE /api/boards/:boardId - Delete board and cascade
router.delete("/:boardId", requireBoardAdmin, boardController.deleteBoard);

module.exports = router;
