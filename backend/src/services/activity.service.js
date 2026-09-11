const { activityRepository } = require("../repositories");

/**
 * Activity Log Service
 * Handles recording and retrieval of activity logs across boards.
 */
class ActivityService {
  /**
   * Log an activity on a board
   * @param {object} params
   * @param {string} params.boardId
   * @param {string} params.userId
   * @param {string} params.who
   * @param {string} params.what
   * @param {string} [params.action]
   * @param {string} [params.description]
   * @returns {Promise<object>}
   */
  async logAction({ boardId, userId, who, what, action = "ACTION", description = null }) {
    if (!boardId) return null;
    return activityRepository.create({
      boardId,
      userId,
      who,
      what,
      action,
      description,
    });
  }

  /**
   * Get activity logs for a board
   * @param {string} boardId
   * @returns {Promise<Array<object>>}
   */
  async getBoardActivities(boardId) {
    return activityRepository.findByBoardId(boardId);
  }
}

module.exports = new ActivityService();
