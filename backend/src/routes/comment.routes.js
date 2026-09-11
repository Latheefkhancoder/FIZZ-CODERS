const express = require("express");
const { commentController } = require("../controllers");
const { authenticate, requireBoardAccess, validate } = require("../middleware");
const { validateCreateComment } = require("../validators");

const router = express.Router({ mergeParams: true });

router.use(authenticate);

// GET /api/tasks/:taskId/comments
router.get("/", requireBoardAccess, commentController.getComments);

// POST /api/tasks/:taskId/comments
router.post("/", requireBoardAccess, validate(validateCreateComment), commentController.addComment);

module.exports = router;
