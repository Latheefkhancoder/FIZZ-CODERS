const { db } = require("../config/firebase");

/**
 * Task Comment Repository
 * Manages comments on tasks using Firebase Firestore.
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
    const commentRef = db.collection("comments").doc();
    const now = new Date().toISOString();

    const comment = {
      id: commentRef.id,
      taskId: String(taskId),
      boardId: String(boardId),
      author: author || "User",
      authorId: String(authorId),
      text: text.trim(),
      timestamp: now,
      createdAt: now,
    };

    await commentRef.set(comment);
    return { ...comment };
  }

  /**
   * Find all comments for a task
   * @param {string} taskId
   * @returns {Promise<Array<object>>}
   */
  async findByTaskId(taskId) {
    if (!taskId) return [];

    const snapshot = await db.collection("comments")
      .where("taskId", "==", String(taskId))
      .get();

    const results = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    return results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  /**
   * Delete all comments for a task
   * @param {string} taskId
   * @returns {Promise<number>}
   */
  async deleteByTaskId(taskId) {
    if (!taskId) return 0;

    const snapshot = await db.collection("comments")
      .where("taskId", "==", String(taskId))
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

  /**
   * Delete all comments for a board
   * @param {string} boardId
   * @returns {Promise<number>}
   */
  async deleteByBoardId(boardId) {
    if (!boardId) return 0;

    const snapshot = await db.collection("comments")
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

module.exports = new CommentRepository();
