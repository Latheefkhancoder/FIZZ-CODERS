const { commentRepository, taskRepository } = require("../repositories");
const activityService = require("./activity.service");

/**
 * Comment Service
 * Handles comment creation on tasks and activity logging.
 */
class CommentService {
  /**
   * Get all comments for a task
   * @param {string} taskId
   * @returns {Promise<Array<object>>}
   */
  async getTaskComments(taskId) {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }
    return commentRepository.findByTaskId(taskId);
  }

  /**
   * Add a comment to a task
   * @param {object} params
   * @param {string} params.taskId
   * @param {string} params.text
   * @param {string} params.authorId
   * @param {string} params.authorName
   * @returns {Promise<object>}
   */
  async addComment({ taskId, text, authorId, authorName }) {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    const comment = await commentRepository.create({
      taskId,
      boardId: task.boardId,
      author: authorName,
      authorId,
      text,
    });

    // Record activity log
    await activityService.logAction({
      boardId: task.boardId,
      userId: authorId,
      who: authorName,
      what: `commented on "${task.title}"`,
      action: "COMMENT_CREATED",
      description: `commented on "${task.title}"`,
    });

    return comment;
  }
}

module.exports = new CommentService();
