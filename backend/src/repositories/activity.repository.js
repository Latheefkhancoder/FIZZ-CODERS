const memoryStore = require("./memoryStore");

/**
 * Activity Log Repository
 * Manages activity logs for boards with in-memory persistence.
 */
class ActivityRepository {
  /**
   * Create an activity log entry
   * @param {object} params
   * @param {string} params.boardId
   * @param {string} params.userId
   * @param {string} params.who
   * @param {string} params.what
   * @param {string} [params.action]
   * @param {string} [params.description]
   * @returns {Promise<object>}
   */
  async create({ boardId, userId, who, what, action = "ACTION", description = null }) {
    const id = `act_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const now = new Date().toISOString();

    const entry = {
      id,
      boardId: String(boardId),
      userId: String(userId),
      who: who || "User",
      what: what || description || "Performed an action",
      action,
      description: description || what,
      when: now,
      createdAt: now,
    };

    memoryStore.activityLogs.set(id, entry);
    return { ...entry };
  }

  /**
   * Find all activity logs for a board (sorted newest first)
   * @param {string} boardId
   * @param {number} [limit=50]
   * @returns {Promise<Array<object>>}
   */
  async findByBoardId(boardId, limit = 100) {
    const boardIdStr = String(boardId);
    const results = [];

    for (const entry of memoryStore.activityLogs.values()) {
      if (entry.boardId === boardIdStr) {
        results.push({ ...entry });
      }
    }

    return results
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }

  /**
   * Delete all activity logs for a board
   * @param {string} boardId
   * @returns {Promise<number>}
   */
  async deleteByBoardId(boardId) {
    const boardIdStr = String(boardId);
    let count = 0;

    for (const [id, entry] of memoryStore.activityLogs.entries()) {
      if (entry.boardId === boardIdStr) {
        memoryStore.activityLogs.delete(id);
        count++;
      }
    }
    return count;
  }
}

module.exports = new ActivityRepository();
