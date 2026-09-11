const memoryStore = require("./memoryStore");

/**
 * Task Repository
 * Manages task persistence with in-memory development implementation.
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
    const id = `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const now = new Date().toISOString();

    const task = {
      id,
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

    memoryStore.tasks.set(id, task);
    return { ...task };
  }

  /**
   * Find task by ID
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  async findById(id) {
    if (!id) return null;
    const task = memoryStore.tasks.get(String(id));
    return task ? { ...task } : null;
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
    const boardIdStr = String(boardId);
    let results = [];

    for (const task of memoryStore.tasks.values()) {
      if (task.boardId === boardIdStr) {
        results.push({ ...task });
      }
    }

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
          t.title.toLowerCase().includes(term) ||
          t.description.toLowerCase().includes(term)
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
    const userIdStr = String(userId);
    const results = [];

    for (const task of memoryStore.tasks.values()) {
      if (task.assignee === userIdStr) {
        if (!accessibleBoardIds || accessibleBoardIds.has(task.boardId)) {
          results.push({ ...task });
        }
      }
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
    const idStr = String(id);
    const existing = memoryStore.tasks.get(idStr);
    if (!existing) return null;

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

    memoryStore.tasks.set(idStr, updated);
    return { ...updated };
  }

  /**
   * Delete a task by ID
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    return memoryStore.tasks.delete(String(id));
  }

  /**
   * Delete all tasks for a board
   * @param {string} boardId
   * @returns {Promise<number>}
   */
  async deleteByBoardId(boardId) {
    const boardIdStr = String(boardId);
    let count = 0;

    for (const [id, task] of memoryStore.tasks.entries()) {
      if (task.boardId === boardIdStr) {
        memoryStore.tasks.delete(id);
        count++;
      }
    }
    return count;
  }
}

module.exports = new TaskRepository();
