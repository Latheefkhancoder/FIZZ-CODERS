const { db } = require("../config/firebase");

/**
 * Chat Repository
 * Manages team chat messages for boards using Firebase Firestore.
 */
class ChatRepository {
  /**
   * Create a new chat message
   * @param {object} params
   * @param {string} params.boardId
   * @param {string} params.author
   * @param {string} params.authorId
   * @param {string} params.text
   * @returns {Promise<object>}
   */
  async create({ boardId, author, authorId, text }) {
    const chatRef = db.collection("chatMessages").doc();
    const now = new Date().toISOString();

    const message = {
      id: chatRef.id,
      boardId: String(boardId),
      author: author || "User",
      authorId: String(authorId),
      text: text.trim(),
      timestamp: now,
      createdAt: now,
    };

    await chatRef.set(message);
    return { ...message };
  }

  /**
   * Find all chat messages for a board (sorted chronologically)
   * @param {string} boardId
   * @returns {Promise<Array<object>>}
   */
  async findByBoardId(boardId) {
    if (!boardId) return [];

    const snapshot = await db.collection("chatMessages")
      .where("boardId", "==", String(boardId))
      .get();

    const results = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    return results.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  /**
   * Delete all chat messages for a board
   * @param {string} boardId
   * @returns {Promise<number>}
   */
  async deleteByBoardId(boardId) {
    if (!boardId) return 0;

    const snapshot = await db.collection("chatMessages")
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

module.exports = new ChatRepository();
