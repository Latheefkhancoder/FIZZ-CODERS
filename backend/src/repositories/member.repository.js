const memoryStore = require("./memoryStore");

/**
 * Board Member Repository
 * Manages board membership records with in-memory persistence.
 */
class MemberRepository {
  /**
   * Create a membership record
   * @param {object} params
   * @param {string} params.boardId
   * @param {string} params.userId
   * @param {string} params.name
   * @param {string} params.email
   * @param {string} [params.role] - 'Admin' or 'Member'
   * @returns {Promise<object>}
   */
  async create({ boardId, userId, name, email, role = "Member" }) {
    const id = `member_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const initials = (name && name.trim().length > 0) ? name.trim()[0].toUpperCase() : "U";

    const member = {
      id,
      boardId: String(boardId),
      userId: String(userId),
      name: name ? name.trim() : "",
      email: email ? email.toLowerCase().trim() : "",
      role: role === "Admin" ? "Admin" : "Member",
      initials,
      joinedAt: new Date().toISOString(),
    };

    memoryStore.members.set(id, member);
    return { ...member };
  }

  /**
   * Find member by board ID and user ID
   * @param {string} boardId
   * @param {string} userId
   * @returns {Promise<object|null>}
   */
  async findByBoardAndUser(boardId, userId) {
    const boardIdStr = String(boardId);
    const userIdStr = String(userId);

    for (const member of memoryStore.members.values()) {
      if (member.boardId === boardIdStr && member.userId === userIdStr) {
        return { ...member };
      }
    }
    return null;
  }

  /**
   * Find member by membership ID
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  async findById(id) {
    const member = memoryStore.members.get(String(id));
    return member ? { ...member } : null;
  }

  /**
   * Find all members of a board
   * @param {string} boardId
   * @returns {Promise<Array<object>>}
   */
  async findByBoardId(boardId) {
    const boardIdStr = String(boardId);
    const results = [];

    for (const member of memoryStore.members.values()) {
      if (member.boardId === boardIdStr) {
        results.push({ ...member });
      }
    }

    return results.sort((a, b) => new Date(a.joinedAt) - new Date(b.joinedAt));
  }

  /**
   * Get all board IDs a user belongs to
   * @param {string} userId
   * @returns {Promise<Set<string>>}
   */
  async findUserBoardIds(userId) {
    const userIdStr = String(userId);
    const boardIds = new Set();

    for (const member of memoryStore.members.values()) {
      if (member.userId === userIdStr) {
        boardIds.add(member.boardId);
      }
    }

    return boardIds;
  }

  /**
   * Update member role within a board
   * @param {string} boardId
   * @param {string} userId
   * @param {string} role - 'Admin' or 'Member'
   * @returns {Promise<object|null>}
   */
  async updateRole(boardId, userId, role) {
    const boardIdStr = String(boardId);
    const userIdStr = String(userId);

    for (const [id, member] of memoryStore.members.entries()) {
      if (member.boardId === boardIdStr && member.userId === userIdStr) {
        const updated = {
          ...member,
          role: role === "Admin" ? "Admin" : "Member",
          updatedAt: new Date().toISOString(),
        };
        memoryStore.members.set(id, updated);
        return { ...updated };
      }
    }
    return null;
  }

  /**
   * Remove member from board
   * @param {string} boardId
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  async delete(boardId, userId) {
    const boardIdStr = String(boardId);
    const userIdStr = String(userId);

    for (const [id, member] of memoryStore.members.entries()) {
      if (member.boardId === boardIdStr && member.userId === userIdStr) {
        memoryStore.members.delete(id);
        return true;
      }
    }
    return false;
  }

  /**
   * Delete all members for a board
   * @param {string} boardId
   * @returns {Promise<number>}
   */
  async deleteByBoardId(boardId) {
    const boardIdStr = String(boardId);
    let count = 0;

    for (const [id, member] of memoryStore.members.entries()) {
      if (member.boardId === boardIdStr) {
        memoryStore.members.delete(id);
        count++;
      }
    }
    return count;
  }
}

module.exports = new MemberRepository();
