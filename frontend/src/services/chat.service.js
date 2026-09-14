import { api } from './api';

export const chatService = {
  /**
   * Get all chat messages for a specific board
   * @param {string} boardId
   * @returns {Promise<Array<object>>}
   */
  getChatMessages: async (boardId) => {
    if (!boardId) return [];
    const res = await api.get(`/boards/${boardId}/chat`);
    return res.data || [];
  },

  /**
   * Send a new message to the board's chat channel
   * @param {string} boardId
   * @param {string} text
   * @returns {Promise<object>}
   */
  sendMessage: async (boardId, text) => {
    const res = await api.post(`/boards/${boardId}/chat`, {
      text: text.trim(),
    });
    return res.data;
  },
};

export default chatService;
