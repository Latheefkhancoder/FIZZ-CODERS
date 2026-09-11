const { chatRepository, boardRepository } = require("../repositories");

/**
 * Chat Service
 * Handles sending and retrieving team chat messages for boards.
 */
class ChatService {
  /**
   * Get all chat messages for a board
   * @param {string} boardId
   * @returns {Promise<Array<object>>}
   */
  async getBoardMessages(boardId) {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      const error = new Error("Board not found");
      error.statusCode = 404;
      throw error;
    }
    return chatRepository.findByBoardId(boardId);
  }

  /**
   * Send a chat message to a board
   * @param {object} params
   * @param {string} params.boardId
   * @param {string} params.text
   * @param {string} params.authorId
   * @param {string} params.authorName
   * @returns {Promise<object>}
   */
  async sendMessage({ boardId, text, authorId, authorName }) {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      const error = new Error("Board not found");
      error.statusCode = 404;
      throw error;
    }

    return chatRepository.create({
      boardId,
      author: authorName,
      authorId,
      text,
    });
  }
}

module.exports = new ChatService();
