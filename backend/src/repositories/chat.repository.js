const memoryStore = require("./memoryStore");

/**
 * Chat Repository
 * Manages team chat messages for boards with in-memory persistence.
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
    const id = `ch_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const now = new Date().toISOString();

    const message = {
      id,
      boardId: String(boardId),
      author: author || "User",
      authorId: String(authorId),
      text: text.trim(),
      timestamp: now,
      createdAt: now,
    };

    memoryStore.chatMessages.set(id, message);
    return { ...message };
  }

  /**
   * Find all chat messages for a board (sorted chronologically)
   * @param {string} boardId
   * @returns {Promise<Array<object>>}
   */
  async findByBoardId(boardId) {
    const boardIdStr = String(boardId);
    const results = [];

    for (const msg of memoryStore.chatMessages.values()) {
      if (msg.boardId === boardIdStr) {
        results.push({ ...msg });
      }
    }

    return results.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  /**
   * Delete all chat messages for a board
   * @param {string} boardId
   * @returns {Promise<number>}
   */
  async deleteByBoardId(boardId) {
    const boardIdStr = String(boardId);
    let count = 0;

    for (const [id, msg] of memoryStore.chatMessages.entries()) {
      if (msg.boardId === boardIdStr) {
        memoryStore.chatMessages.delete(id);
        count++;
      }
    }
    return count;
  }
}

module.exports = new ChatRepository();
