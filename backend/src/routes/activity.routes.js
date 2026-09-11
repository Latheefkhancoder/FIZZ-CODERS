const express = require("express");
const { activityController } = require("../controllers");
const { authenticate, requireBoardAccess } = require("../middleware");

const router = express.Router({ mergeParams: true });

router.use(authenticate);

// GET /api/boards/:boardId/activity-logs
router.get("/", requireBoardAccess, activityController.getActivityLogs);

module.exports = router;
