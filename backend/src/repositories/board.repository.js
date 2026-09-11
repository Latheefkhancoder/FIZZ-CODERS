const memoryStore = require("./memoryStore");

/**
 * Board Repository
 * Manages board persistence with an in-memory development implementation.
 * Prepared for Firebase/Firestore replacement.
 */
class BoardRepository {
  /**
   * Create a new board
   * @param {object} params
   * @param {string} params.name
   * @param {string} params.code
   * @param {string} params.ownerId
   * @returns {Promise<object>}
   */
  async create({ name, code, ownerId }) {
    const id = `board_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const now = new Date().toISOString();

    const board = {
      id,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      ownerId: String(ownerId),
      createdAt: now,
      updatedAt: now,
    };

    memoryStore.boards.set(id, board);
    return { ...board };
  }

  /**
   * Find board by ID
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  async findById(id) {
    if (!id) return null;
    const board = memoryStore.boards.get(String(id));
    return board ? { ...board } : null;
  }

  /**
   * Find board by 5-character join code
   * @param {string} code
   * @returns {Promise<object|null>}
   */
  async findByCode(code) {
    if (!code) return null;
    const normalized = code.trim().toUpperCase();
    for (const board of memoryStore.boards.values()) {
      if (board.code === normalized) {
        return { ...board };
      }
    }
    return null;
  }

  /**
   * Find all boards where user is owner or member
   * @param {string} userId
   * @param {Set<string>} memberBoardIds
   * @returns {Promise<Array<object>>}
   */
  async findUserBoards(userId, memberBoardIds = new Set()) {
    const userIdStr = String(userId);
    const results = [];

    for (const board of memoryStore.boards.values()) {
      if (board.ownerId === userIdStr || memberBoardIds.has(board.id)) {
        results.push({ ...board });
      }
    }

    // Sort newest first
    return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  /**
   * Find all boards (admin or internal lookup)
   * @returns {Promise<Array<object>>}
   */
  async findAll() {
    return Array.from(memoryStore.boards.values()).map((b) => ({ ...b }));
  }

  /**
   * Delete a board by ID
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    return memoryStore.boards.delete(String(id));
  }
}

module.exports = new BoardRepository();
