const { memberRepository, userRepository, boardRepository } = require("../repositories");
const activityService = require("./activity.service");

/**
 * Member Service
 * Handles board membership, inviting existing users, role modifications, and member removals.
 */
class MemberService {
  /**
   * Get all members for a board
   * @param {string} boardId
   * @returns {Promise<Array<object>>}
   */
  async getBoardMembers(boardId) {
    return memberRepository.findByBoardId(boardId);
  }

  /**
   * Add an existing user as a member to a board
   * @param {object} params
   * @param {string} params.boardId
   * @param {string} params.email
   * @param {string} [params.role='Member']
   * @param {string} params.actorUserId
   * @param {string} params.actorName
   * @returns {Promise<object>}
   */
  async addMember({ boardId, email, role = "Member", actorUserId, actorName }) {
    const cleanEmail = email.toLowerCase().trim();

    // Verify board exists
    const board = await boardRepository.findById(boardId);
    if (!board) {
      const error = new Error("Board not found");
      error.statusCode = 404;
      throw error;
    }

    // Verify user exists in authentication system (NO fake users)
    const user = await userRepository.findByEmail(cleanEmail);
    if (!user) {
      const error = new Error(`User with email "${cleanEmail}" does not exist. Users must register first.`);
      error.statusCode = 404;
      throw error;
    }

    // Check if user is already the board owner
    if (String(board.ownerId) === String(user.id)) {
      const error = new Error("User is the owner of this board");
      error.statusCode = 409;
      throw error;
    }

    // Check if already a member
    const existingMember = await memberRepository.findByBoardAndUser(boardId, user.id);
    if (existingMember) {
      const error = new Error(`User "${cleanEmail}" is already a member of this board`);
      error.statusCode = 409;
      throw error;
    }

    // Create member record
    const memberRole = role === "Admin" ? "Admin" : "Member";
    const member = await memberRepository.create({
      boardId,
      userId: user.id,
      name: user.name,
      email: user.email,
      role: memberRole,
    });

    // Record activity log
    await activityService.logAction({
      boardId,
      userId: actorUserId,
      who: actorName,
      what: `added member "${user.name || cleanEmail}" as ${memberRole}`,
      action: "MEMBER_ADDED",
      description: `added member "${user.name || cleanEmail}" as ${memberRole}`,
    });

    return member;
  }

  /**
   * Update a member's role on the board
   * @param {object} params
   * @param {string} params.boardId
   * @param {string} params.targetUserId
   * @param {string} params.newRole
   * @param {string} params.actorUserId
   * @param {string} params.actorName
   * @returns {Promise<object>}
   */
  async updateMemberRole({ boardId, targetUserId, newRole, actorUserId, actorName }) {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      const error = new Error("Board not found");
      error.statusCode = 404;
      throw error;
    }

    // Board owner role cannot be changed
    if (String(board.ownerId) === String(targetUserId)) {
      const error = new Error("Cannot alter the role of the board owner");
      error.statusCode = 400;
      throw error;
    }

    const member = await memberRepository.findByBoardAndUser(boardId, targetUserId);
    if (!member) {
      const error = new Error("Member not found on this board");
      error.statusCode = 404;
      throw error;
    }

    const updated = await memberRepository.updateRole(boardId, targetUserId, newRole);

    // Record activity log
    await activityService.logAction({
      boardId,
      userId: actorUserId,
      who: actorName,
      what: `updated role for member "${member.name}" to ${newRole}`,
      action: "MEMBER_ROLE_UPDATED",
      description: `updated role for member "${member.name}" to ${newRole}`,
    });

    return updated;
  }

  /**
   * Remove a member from the board
   * @param {object} params
   * @param {string} params.boardId
   * @param {string} params.targetUserId
   * @param {string} params.actorUserId
   * @param {string} params.actorName
   * @returns {Promise<boolean>}
   */
  async removeMember({ boardId, targetUserId, actorUserId, actorName }) {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      const error = new Error("Board not found");
      error.statusCode = 404;
      throw error;
    }

    // Cannot remove board owner
    if (String(board.ownerId) === String(targetUserId)) {
      const error = new Error("Cannot remove the owner of the board");
      error.statusCode = 400;
      throw error;
    }

    const member = await memberRepository.findByBoardAndUser(boardId, targetUserId);
    if (!member) {
      const error = new Error("Member not found on this board");
      error.statusCode = 404;
      throw error;
    }

    await memberRepository.delete(boardId, targetUserId);

    // Record activity log
    await activityService.logAction({
      boardId,
      userId: actorUserId,
      who: actorName,
      what: `removed member "${member.name}"`,
      action: "MEMBER_REMOVED",
      description: `removed member "${member.name}"`,
    });

    return true;
  }
}

module.exports = new MemberService();
