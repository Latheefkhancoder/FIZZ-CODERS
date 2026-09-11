const { chatService } = require("../services");
const { successResponse } = require("../utils/response");

/**
 * Chat Controller
 */

const getChatMessages = async (req, res, next) => {
  try {
    const messages = await chatService.getBoardMessages(req.params.boardId);
    return successResponse(res, "Chat messages retrieved successfully", messages, 200);
  } catch (err) {
    next(err);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { text } = req.body;
    const message = await chatService.sendMessage({
      boardId: req.params.boardId,
      text,
      authorId: req.user.id,
      authorName: req.user.name || "User",
    });
    return successResponse(res, "Message sent successfully", message, 201);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getChatMessages,
  sendMessage,
};
