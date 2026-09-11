const memoryStore = require("./memoryStore");

/**
 * Task Comment Repository
 * Manages comments on tasks with in-memory persistence.
 */
class CommentRepository {
  /**
   * Create a new task comment
   * @param {object} params
   * @param {string} params.taskId
   * @param {string} params.boardId
   * @param {string} params.author
   * @param {string} params.authorId
   * @param {string} params.text
   * @returns {Promise<object>}
   */
  async create({ taskId, boardId, author, authorId, text }) {
    const id = `comment_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const now = new Date().toISOString();

    const comment = {
      id,
      taskId: String(taskId),
      boardId: String(boardId),
      author: author || "User",
      authorId: String(authorId),
      text: text.trim(),
      timestamp: now,
      createdAt: now,
    };

    memoryStore.comments.set(id, comment);

    // Also push to task's internal comments array if task exists
    const task = memoryStore.tasks.get(String(taskId));
    if (task) {
      if (!task.comments) task.comments = [];
      task.comments.push({ ...comment });
    }

    return { ...comment };
  }

  /**
   * Find all comments for a task
   * @param {string} taskId
   * @returns {Promise<Array<object>>}
   */
  async findByTaskId(taskId) {
    const taskIdStr = String(taskId);
    const results = [];

    for (const comment of memoryStore.comments.values()) {
      if (comment.taskId === taskIdStr) {
        results.push({ ...comment });
      }
    }

    return results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  /**
   * Delete all comments for a task
   * @param {string} taskId
   * @returns {Promise<number>}
   */
  async deleteByTaskId(taskId) {
    const taskIdStr = String(taskId);
    let count = 0;

    for (const [id, comment] of memoryStore.comments.entries()) {
      if (comment.taskId === taskIdStr) {
        memoryStore.comments.delete(id);
        count++;
      }
    }
    return count;
  }

  /**
   * Delete all comments for a board
   * @param {string} boardId
   * @returns {Promise<number>}
   */
  async deleteByBoardId(boardId) {
    const boardIdStr = String(boardId);
    let count = 0;

    for (const [id, comment] of memoryStore.comments.entries()) {
      if (comment.boardId === boardIdStr) {
        memoryStore.comments.delete(id);
        count++;
      }
    }
    return count;
  }
}

module.exports = new CommentRepository();
