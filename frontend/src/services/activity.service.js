import { api } from './api';

export const activityService = {
  /**
   * Get activity logs for a specific board
   * @param {string} boardId
   * @returns {Promise<Array<object>>}
   */
  getActivityLogs: async (boardId) => {
    if (!boardId) return [];
    const res = await api.get(`/boards/${boardId}/activity-logs`);
    return res.data || [];
  },
};

export default activityService;
