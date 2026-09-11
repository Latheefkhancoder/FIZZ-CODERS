const { commentService } = require("../services");
const { successResponse } = require("../utils/response");

/**
 * Comment Controller
 */

const getComments = async (req, res, next) => {
  try {
    const comments = await commentService.getTaskComments(req.params.taskId);
    return successResponse(res, "Comments retrieved successfully", comments, 200);
  } catch (err) {
    next(err);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const comment = await commentService.addComment({
      taskId: req.params.taskId,
      text,
      authorId: req.user.id,
      authorName: req.user.name || "User",
    });
    return successResponse(res, "Comment added successfully", comment, 201);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getComments,
  addComment,
};
