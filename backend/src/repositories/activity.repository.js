const { db } = require("../config/firebase");

/**
 * Activity Log Repository
 * Manages activity logs for boards using Firebase Firestore.
 */
class ActivityRepository {
  /**
   * Create an activity log entry
   * @param {object} params
   * @param {string} params.boardId
   * @param {string} params.userId
   * @param {string} params.who
   * @param {string} params.what
   * @param {string} [params.action='ACTION']
   * @param {string} [params.description=null]
   * @returns {Promise<object>}
   */
  async create({ boardId, userId, who, what, action = "ACTION", description = null }) {
    const actRef = db.collection("activityLogs").doc();
    const now = new Date().toISOString();

    const entry = {
      id: actRef.id,
      boardId: String(boardId),
      userId: String(userId),
      who: who || "User",
      what: what || description || "Performed an action",
      action,
      description: description || what,
      when: now,
      createdAt: now,
    };

    await actRef.set(entry);
    return { ...entry };
  }

  /**
   * Find all activity logs for a board (sorted newest first)
   * @param {string} boardId
   * @param {number} [limit=100]
   * @returns {Promise<Array<object>>}
   */
  async findByBoardId(boardId, limit = 100) {
    if (!boardId) return [];

    const snapshot = await db.collection("activityLogs")
      .where("boardId", "==", String(boardId))
      .get();

    const results = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

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
    if (!boardId) return 0;

    const snapshot = await db.collection("activityLogs")
      .where("boardId", "==", String(boardId))
      .get();

    if (snapshot.empty) return 0;

    const docs = snapshot.docs;
    const batchSize = 400;

    for (let i = 0; i < docs.length; i += batchSize) {
      const batch = db.batch();
      const chunk = docs.slice(i, i + batchSize);
      chunk.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }

    return docs.length;
  }
}

module.exports = new ActivityRepository();
