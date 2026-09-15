const { db } = require("../config/firebase");

/**
 * Board Repository
 * Manages board persistence using Firebase Firestore.
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
    const now = new Date().toISOString();

    const boardRef = db.collection("boards").doc();

    const board = {
      id: boardRef.id,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      ownerId: String(ownerId),
      createdAt: now,
      updatedAt: now,
    };

    await boardRef.set(board);

    return { ...board };
  }

  /**
   * Find board by ID
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  async findById(id) {
    if (!id) return null;

    const boardDoc = await db.collection("boards").doc(String(id)).get();

    if (!boardDoc.exists) {
      return null;
    }

    return {
      ...boardDoc.data(),
      id: boardDoc.id,
    };
  }

  /**
   * Find board by 5-character join code
   * @param {string} code
   * @returns {Promise<object|null>}
   */
  async findByCode(code) {
    if (!code) return null;

    const normalized = code.trim().toUpperCase();

    const snapshot = await db
      .collection("boards")
      .where("code", "==", normalized)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];

    return {
      ...doc.data(),
      id: doc.id,
    };
  }

  /**
   * Find all boards where user is owner or member
   * @param {string} userId
   * @param {Set<string>} memberBoardIds
   * @returns {Promise<Array<object>>}
   */
  async findUserBoards(userId, memberBoardIds = new Set()) {
    const userIdStr = String(userId);

    const snapshot = await db.collection("boards").get();

    const results = [];

    snapshot.forEach((doc) => {
      const board = {
        ...doc.data(),
        id: doc.id,
      };

      if (
        board.ownerId === userIdStr ||
        memberBoardIds.has(board.id)
      ) {
        results.push(board);
      }
    });

    // Sort newest first
    return results.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  /**
   * Find all boards
   * @returns {Promise<Array<object>>}
   */
  async findAll() {
    const snapshot = await db.collection("boards").get();

    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  }

  /**
   * Delete a board by ID
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    if (!id) return false;

    const boardRef = db.collection("boards").doc(String(id));
    const boardDoc = await boardRef.get();

    if (!boardDoc.exists) {
      return false;
    }

    await boardRef.delete();

    return true;
  }
}

module.exports = new BoardRepository();