import { api } from './api';

export const memberService = {
  /**
   * Get all members belonging to a board
   * @param {string} boardId
   * @returns {Promise<Array<object>>}
   */
  getBoardMembers: async (boardId) => {
    if (!boardId) return [];
    const res = await api.get(`/boards/${boardId}/members`);
    return res.data || [];
  },

  /**
   * Add a registered user as a member to a board
   * @param {string} boardId
   * @param {object} payload - { email, role }
   * @returns {Promise<object>}
   */
  addMember: async (boardId, { email, role = 'Member' }) => {
    const res = await api.post(`/boards/${boardId}/members`, {
      email: email.trim().toLowerCase(),
      role,
    });
    return res.data;
  },

  /**
   * Update a member's role on the board
   * @param {string} boardId
   * @param {string} userId
   * @param {string} role - 'Admin' | 'Member'
   * @returns {Promise<object>}
   */
  updateMemberRole: async (boardId, userId, role) => {
    const res = await api.patch(`/boards/${boardId}/members/${userId}`, {
      role,
    });
    return res.data;
  },

  /**
   * Remove a member from the board
   * Note: The backend expects the member's `userId`, not the member document ID.
   * @param {string} boardId
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  removeMember: async (boardId, userId) => {
    const res = await api.delete(`/boards/${boardId}/members/${userId}`);
    return res.success;
  },
};

export default memberService;
