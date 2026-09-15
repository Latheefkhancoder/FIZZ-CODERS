const { db } = require("../config/firebase");

/**
 * Task Repository
 * Manages task persistence using Firebase Firestore.
 */
class TaskRepository {
  /**
   * Create a new task
   * @param {object} params
   * @returns {Promise<object>}
   */
  async create({
    boardId,
    title,
    description = "",
    priority = "MEDIUM",
    status = "TODO",
    creatorId,
    creatorName,
    assignee = null,
    dueDate = null,
  }) {
    const taskRef = db.collection("tasks").doc();
    const now = new Date().toISOString();

    const task = {
      id: taskRef.id,
      boardId: String(boardId),
      title: title.trim(),
      description: description ? description.trim() : "",
      priority: priority.toUpperCase(),
      status: status.toUpperCase(),
      creatorId: String(creatorId),
      creator: creatorName || "User",
      assignee: assignee ? String(assignee) : null,
      dueDate: dueDate || null,
      createdAt: now,
      updatedAt: now,
      comments: [],
    };

    await taskRef.set(task);
    return { ...task };
  }

  /**
   * Find task by ID
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  async findById(id) {
    if (!id) return null;

    const doc = await db.collection("tasks").doc(String(id)).get();
    if (!doc.exists) {
      return null;
    }

    return {
      ...doc.data(),
      id: doc.id,
    };
  }

  /**
   * Find all tasks belonging to a board with optional filtering
   * @param {string} boardId
   * @param {object} [filters]
   * @param {string} [filters.status]
   * @param {string} [filters.priority]
   * @param {string} [filters.search]
   * @returns {Promise<Array<object>>}
   */
  async findByBoardId(boardId, filters = {}) {
    if (!boardId) return [];

    const snapshot = await db.collection("tasks")
      .where("boardId", "==", String(boardId))
      .get();

    let results = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    if (filters.status) {
      const normalizedStatus = filters.status.toUpperCase().replace(/\s+/g, "_");
      results = results.filter((t) => t.status === normalizedStatus);
    }

    if (filters.priority) {
      const normalizedPriority = filters.priority.toUpperCase();
      results = results.filter((t) => t.priority === normalizedPriority);
    }

    if (filters.search) {
      const term = filters.search.toLowerCase();
      results = results.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(term)) ||
          (t.description && t.description.toLowerCase().includes(term))
      );
    }

    return results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  /**
   * Find tasks assigned to a specific user across accessible boards
   * @param {string} userId
   * @param {Set<string>} [accessibleBoardIds]
   * @returns {Promise<Array<object>>}
   */
  async findByAssigneeId(userId, accessibleBoardIds = null) {
    if (!userId) return [];

    const snapshot = await db.collection("tasks")
      .where("assignee", "==", String(userId))
      .get();

    let results = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    if (accessibleBoardIds) {
      results = results.filter((t) => accessibleBoardIds.has(t.boardId));
    }

    return results.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  /**
   * Update task fields
   * @param {string} id
   * @param {object} updates
   * @returns {Promise<object|null>}
   */
  async update(id, updates) {
    if (!id) return null;

    const taskRef = db.collection("tasks").doc(String(id));
    const doc = await taskRef.get();
    if (!doc.exists) {
      return null;
    }

    const existing = { ...doc.data(), id: doc.id };
    const updated = {
      ...existing,
      ...updates,
      id: existing.id,
      boardId: existing.boardId,
      creatorId: existing.creatorId,
      creator: existing.creator,
      updatedAt: new Date().toISOString(),
    };

    if (updates.priority) {
      updated.priority = updates.priority.toUpperCase();
    }

    if (updates.status) {
      updated.status = updates.status.toUpperCase().replace(/\s+/g, "_");
    }

    await taskRef.set(updated);
    return { ...updated };
  }

  /**
   * Delete a task by ID
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    if (!id) return false;

    const taskRef = db.collection("tasks").doc(String(id));
    const doc = await taskRef.get();
    if (!doc.exists) {
      return false;
    }

    await taskRef.delete();
    return true;
  }

  /**
   * Delete all tasks for a board
   * @param {string} boardId
   * @returns {Promise<number>}
   */
  async deleteByBoardId(boardId) {
    if (!boardId) return 0;

    const snapshot = await db.collection("tasks")
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

module.exports = new TaskRepository();
