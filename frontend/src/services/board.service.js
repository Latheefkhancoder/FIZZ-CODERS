import { api } from './api';

export const boardService = {
  /**
   * Get all boards accessible to the current user
   * @returns {Promise<Array<object>>}
   */
  getUserBoards: async () => {
    const res = await api.get('/boards');
    return res.data || [];
  },

  /**
   * Get details for a specific board
   * @param {string} boardId
   * @returns {Promise<object>}
   */
  getBoardById: async (boardId) => {
    const res = await api.get(`/boards/${boardId}`);
    return res.data;
  },

  /**
   * Lookup board preview details by 5-character board code
   * @param {string} code
   * @returns {Promise<object>}
   */
  getBoardByCode: async (code) => {
    const res = await api.get(`/boards/code/${encodeURIComponent(code.trim().toUpperCase())}`);
    return res.data;
  },

  /**
   * Create a new project board
   * @param {object} payload - { name, code }
   * @returns {Promise<object>}
   */
  createBoard: async ({ name, code }) => {
    const res = await api.post('/boards', {
      name: name.trim(),
      code: code.trim().toUpperCase(),
    });
    return res.data;
  },

  /**
   * Join an existing board via code
   * @param {string} code
   * @returns {Promise<object>}
   */
  joinBoard: async (code) => {
    const res = await api.post('/boards/join', {
      code: code.trim().toUpperCase(),
    });
    return res.data;
  },

  /**
   * Delete a board and all associated resources
   * @param {string} boardId
   * @returns {Promise<boolean>}
   */
  deleteBoard: async (boardId) => {
    const res = await api.delete(`/boards/${boardId}`);
    return res.success;
  },
};

export default boardService;
