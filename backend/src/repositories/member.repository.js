const { db } = require("../config/firebase");

/**
 * Board Member Repository
 * Manages board membership records using Firebase Firestore.
 */
class MemberRepository {
  /**
   * Create a membership record
   * @param {object} params
   * @param {string} params.boardId
   * @param {string} params.userId
   * @param {string} params.name
   * @param {string} params.email
   * @param {string} [params.role='Member'] - 'Admin' or 'Member'
   * @returns {Promise<object>}
   */
  async create({ boardId, userId, name, email, role = "Member" }) {
    const memberRef = db.collection("members").doc();
    const initials = (name && name.trim().length > 0) ? name.trim()[0].toUpperCase() : "U";

    const member = {
      id: memberRef.id,
      boardId: String(boardId),
      userId: String(userId),
      name: name ? name.trim() : "",
      email: email ? email.toLowerCase().trim() : "",
      role: role === "Admin" ? "Admin" : "Member",
      initials,
      joinedAt: new Date().toISOString(),
    };

    await memberRef.set(member);
    return { ...member };
  }

  /**
   * Find member by board ID and user ID
   * @param {string} boardId
   * @param {string} userId
   * @returns {Promise<object|null>}
   */
  async findByBoardAndUser(boardId, userId, email = null) {
    if (!boardId || (!userId && !email)) return null;

    const snapshot = await db.collection("members")
      .where("boardId", "==", String(boardId))
      .get();

    if (snapshot.empty) {
      return null;
    }

    const cleanEmail = email ? email.toLowerCase().trim() : null;
    const doc = snapshot.docs.find(d => {
      const data = d.data();
      if (userId && String(data.userId) === String(userId)) return true;
      if (cleanEmail && data.email && data.email.toLowerCase().trim() === cleanEmail) return true;
      return false;
    });

    if (!doc) return null;

    return {
      ...doc.data(),
      id: doc.id,
    };
  }

  /**
   * Find member by membership ID
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  async findById(id) {
    if (!id) return null;

    const doc = await db.collection("members").doc(String(id)).get();
    if (!doc.exists) {
      return null;
    }

    return {
      ...doc.data(),
      id: doc.id,
    };
  }

  /**
   * Find all members of a board
   * @param {string} boardId
   * @returns {Promise<Array<object>>}
   */
  async findByBoardId(boardId) {
    if (!boardId) return [];

    const snapshot = await db.collection("members")
      .where("boardId", "==", String(boardId))
      .get();

    const results = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    return results.sort((a, b) => new Date(a.joinedAt) - new Date(b.joinedAt));
  }

  /**
   * Get all board IDs a user belongs to
   * @param {string} userId
   * @returns {Promise<Set<string>>}
   */
  async findUserBoardIds(userId) {
    if (!userId) return new Set();

    const snapshot = await db.collection("members")
      .where("userId", "==", String(userId))
      .get();

    const boardIds = new Set();
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.boardId) {
        boardIds.add(String(data.boardId));
      }
    });

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
    if (!boardId || !userId) return null;

    const snapshot = await db.collection("members")
      .where("boardId", "==", String(boardId))
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs.find(d => String(d.data().userId) === String(userId));
    if (!doc) return null;

    const updatedRole = role === "Admin" ? "Admin" : "Member";
    const updatedAt = new Date().toISOString();

    await doc.ref.update({
      role: updatedRole,
      updatedAt,
    });

    return {
      ...doc.data(),
      id: doc.id,
      role: updatedRole,
      updatedAt,
    };
  }

  /**
   * Remove member from board
   * @param {string} boardId
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  async delete(boardId, userId) {
    if (!boardId || !userId) return false;

    const snapshot = await db.collection("members")
      .where("boardId", "==", String(boardId))
      .get();

    if (snapshot.empty) {
      return false;
    }

    const doc = snapshot.docs.find(d => String(d.data().userId) === String(userId));
    if (!doc) return false;

    await doc.ref.delete();
    return true;
  }

  /**
   * Delete all members for a board
   * @param {string} boardId
   * @returns {Promise<number>}
   */
  async deleteByBoardId(boardId) {
    if (!boardId) return 0;

    const snapshot = await db.collection("members")
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

module.exports = new MemberRepository();
