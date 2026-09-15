import { api } from './api';

export const commentService = {
  /**
   * Get all comments for a task
   * @param {string} taskId
   * @returns {Promise<Array<object>>}
   */
  getComments: async (taskId) => {
    if (!taskId) return [];
    const res = await api.get(`/tasks/${taskId}/comments`);
    return res.data || [];
  },

  /**
   * Post a new comment on a task
   * @param {string} taskId
   * @param {string} text
   * @returns {Promise<object>}
   */
  addComment: async (taskId, text) => {
    const res = await api.post(`/tasks/${taskId}/comments`, {
      text: text.trim(),
    });
    return res.data;
  },
};

export default commentService;
