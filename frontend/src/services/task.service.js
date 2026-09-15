import { api } from './api';
import { toApiPriority, toApiStatus, normalizeTaskForUi } from '../utils/formatters';

export const taskService = {
  /**
   * Get all tasks for a specific board with optional filtering
   * @param {string} boardId
   * @param {object} [filters] - { status, priority, search }
   * @returns {Promise<Array<object>>}
   */
  getBoardTasks: async (boardId, filters = {}) => {
    if (!boardId) return [];
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', toApiStatus(filters.status));
    if (filters.priority) queryParams.append('priority', toApiPriority(filters.priority));
    if (filters.search) queryParams.append('search', filters.search);

    const queryStr = queryParams.toString();
    const endpoint = `/boards/${boardId}/tasks${queryStr ? `?${queryStr}` : ''}`;
    const res = await api.get(endpoint);
    return (res.data || []).map(normalizeTaskForUi);
  },

  /**
   * Get tasks assigned to the authenticated user across all boards
   * @returns {Promise<Array<object>>}
   */
  getMyTasks: async () => {
    const res = await api.get('/tasks/my');
    return (res.data || []).map(normalizeTaskForUi);
  },

  /**
   * Get task details by ID
   * @param {string} taskId
   * @returns {Promise<object>}
   */
  getTaskById: async (taskId) => {
    const res = await api.get(`/tasks/${taskId}`);
    return normalizeTaskForUi(res.data);
  },

  /**
   * Create a new task in a board
   * @param {string} boardId
   * @param {object} payload - { title, description, priority, assignee, dueDate }
   * @returns {Promise<object>}
   */
  createTask: async (boardId, { title, description, priority, assignee, dueDate }) => {
    const res = await api.post(`/boards/${boardId}/tasks`, {
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: toApiPriority(priority),
      assignee: assignee || null,
      dueDate: dueDate || null,
    });
    return normalizeTaskForUi(res.data);
  },

  /**
   * Update task fields
   * @param {string} taskId
   * @param {object} updates
   * @returns {Promise<object>}
   */
  updateTask: async (taskId, updates) => {
    const payload = { ...updates };
    if (payload.priority) {
      payload.priority = toApiPriority(payload.priority);
    }
    if (payload.status) {
      payload.status = toApiStatus(payload.status);
    }
    const res = await api.patch(`/tasks/${taskId}`, payload);
    return normalizeTaskForUi(res.data);
  },

  /**
   * Move task to a new status
   * @param {string} taskId
   * @param {string} status - 'TODO' | 'IN PROGRESS' | 'DONE'
   * @returns {Promise<object>}
   */
  updateTaskStatus: async (taskId, status) => {
    const res = await api.patch(`/tasks/${taskId}/status`, {
      status: toApiStatus(status),
    });
    return normalizeTaskForUi(res.data);
  },

  /**
   * Delete a task by ID
   * @param {string} taskId
   * @returns {Promise<boolean>}
   */
  deleteTask: async (taskId) => {
    const res = await api.delete(`/tasks/${taskId}`);
    return res.success;
  },
};

export default taskService;
