const express = require("express");
const { chatController } = require("../controllers");
const { authenticate, requireBoardAccess, validate } = require("../middleware");
const { validateSendChatMessage } = require("../validators");

const router = express.Router({ mergeParams: true });

router.use(authenticate);

// GET /api/boards/:boardId/chat
router.get("/", requireBoardAccess, chatController.getChatMessages);

// POST /api/boards/:boardId/chat
router.post("/", requireBoardAccess, validate(validateSendChatMessage), chatController.sendMessage);

module.exports = router;
