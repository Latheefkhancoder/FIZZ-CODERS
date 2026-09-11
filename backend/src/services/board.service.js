const {
  boardRepository,
  memberRepository,
  taskRepository,
  commentRepository,
  activityRepository,
  chatRepository,
} = require("../repositories");
const activityService = require("./activity.service");

/**
 * Board Service
 * Handles board lifecycle, unique code verification, joining, and cascaded deletion.
 */
class BoardService {
  /**
   * Create a new board
   * @param {object} params
   * @param {string} params.name
   * @param {string} params.code
   * @param {string} params.userId
   * @param {string} params.userName
   * @param {string} params.userEmail
   * @returns {Promise<object>}
   */
  async createBoard({ name, code, userId, userName, userEmail }) {
    const normalizedCode = code.trim().toUpperCase();

    // Check code uniqueness
    const existing = await boardRepository.findByCode(normalizedCode);
    if (existing) {
      const error = new Error(`Board code "${normalizedCode}" is already in use. Please choose another code.`);
      error.statusCode = 409;
      throw error;
    }

    // Create board
    const board = await boardRepository.create({
      name: name.trim(),
      code: normalizedCode,
      ownerId: userId,
    });

    // Automatically add creator as Admin member
    await memberRepository.create({
      boardId: board.id,
      userId,
      name: userName,
      email: userEmail,
      role: "Admin",
    });

    // Record activity log
    await activityService.logAction({
      boardId: board.id,
      userId,
      who: userName,
      what: `created board "${board.name}" (Code: ${board.code})`,
      action: "BOARD_CREATED",
      description: `created board "${board.name}" (Code: ${board.code})`,
    });

    return board;
  }

  /**
   * Get all boards accessible to the user
   * @param {string} userId
   * @returns {Promise<Array<object>>}
   */
  async getUserBoards(userId) {
    const memberBoardIds = await memberRepository.findUserBoardIds(userId);
    return boardRepository.findUserBoards(userId, memberBoardIds);
  }

  /**
   * Get board by ID
   * @param {string} boardId
   * @returns {Promise<object>}
   */
  async getBoardById(boardId) {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      const error = new Error("Board not found");
      error.statusCode = 404;
      throw error;
    }
    return board;
  }

  /**
   * Get board information by 5-character join code
   * @param {string} code
   * @returns {Promise<object>}
   */
  async getBoardByCode(code) {
    if (!code) {
      const error = new Error("Board code is required");
      error.statusCode = 400;
      throw error;
    }

    const board = await boardRepository.findByCode(code);
    if (!board) {
      const error = new Error(`No board found with code "${code.toUpperCase()}"`);
      error.statusCode = 404;
      throw error;
    }

    return {
      id: board.id,
      name: board.name,
      code: board.code,
      createdAt: board.createdAt,
    };
  }

  /**
   * Join an existing board via code
   * @param {object} params
   * @param {string} params.code
   * @param {string} params.userId
   * @param {string} params.userName
   * @param {string} params.userEmail
   * @returns {Promise<object>}
   */
  async joinBoard({ code, userId, userName, userEmail }) {
    const normalizedCode = code.trim().toUpperCase();
    const board = await boardRepository.findByCode(normalizedCode);

    if (!board) {
      const error = new Error(`Invalid board code "${normalizedCode}". Board not found.`);
      error.statusCode = 404;
      throw error;
    }

    const userIdStr = String(userId);

    // Check if user is already the owner
    if (String(board.ownerId) === userIdStr) {
      const error = new Error("You are already the owner of this board");
      error.statusCode = 409;
      throw error;
    }

    // Check if already a member
    const existingMember = await memberRepository.findByBoardAndUser(board.id, userIdStr);
    if (existingMember) {
      const error = new Error("You are already a member of this board");
      error.statusCode = 409;
      throw error;
    }

    // Create membership
    await memberRepository.create({
      boardId: board.id,
      userId: userIdStr,
      name: userName,
      email: userEmail,
      role: "Member",
    });

    // Record activity log
    await activityService.logAction({
      boardId: board.id,
      userId: userIdStr,
      who: userName,
      what: `joined the board "${board.name}"`,
      action: "BOARD_JOINED",
      description: `joined the board "${board.name}"`,
    });

    return board;
  }

  /**
   * Delete a board and cascade delete its associated data
   * @param {string} boardId
   * @param {string} userId
   * @param {string} userName
   * @returns {Promise<boolean>}
   */
  async deleteBoard(boardId, userId, userName) {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      const error = new Error("Board not found");
      error.statusCode = 404;
      throw error;
    }

    // Cascade deletions
    await taskRepository.deleteByBoardId(boardId);
    await commentRepository.deleteByBoardId(boardId);
    await chatRepository.deleteByBoardId(boardId);
    await activityRepository.deleteByBoardId(boardId);
    await memberRepository.deleteByBoardId(boardId);
    await boardRepository.delete(boardId);

    return true;
  }
}

module.exports = new BoardService();
