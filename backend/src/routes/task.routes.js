const express = require("express");
const { taskController } = require("../controllers");
const { authenticate, requireBoardAccess, validate } = require("../middleware");
const { validateUpdateTask, validateUpdateTaskStatus } = require("../validators");
const commentRoutes = require("./comment.routes");

const router = express.Router();

router.use(authenticate);

// Mount task comments sub-router
router.use("/:taskId/comments", commentRoutes);

// GET /api/tasks/my
router.get("/my", taskController.getMyTasks);

// GET /api/tasks/:taskId
router.get("/:taskId", requireBoardAccess, taskController.getTaskById);

// PATCH /api/tasks/:taskId
router.patch("/:taskId", requireBoardAccess, validate(validateUpdateTask), taskController.updateTask);

// PATCH /api/tasks/:taskId/status
router.patch(
  "/:taskId/status",
  requireBoardAccess,
  validate(validateUpdateTaskStatus),
  taskController.updateTaskStatus
);

// DELETE /api/tasks/:taskId
router.delete("/:taskId", requireBoardAccess, taskController.deleteTask);

module.exports = router;
