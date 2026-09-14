import { api } from './api';

export const profileService = {
  /**
   * Get authenticated user profile
   * @returns {Promise<object>}
   */
  getProfile: async () => {
    const res = await api.get('/profile');
    return res.data;
  },

  /**
   * Update user profile
   * Note: The backend PATCH /api/profile accepts only { name, bio }.
   * Email is read-only.
   * @param {object} payload - { name, bio }
   * @returns {Promise<object>}
   */
  updateProfile: async ({ name, bio }) => {
    const payload = {};
    if (name !== undefined) payload.name = name.trim();
    if (bio !== undefined) payload.bio = bio ? bio.trim() : '';

    const res = await api.patch('/profile', payload);
    return res.data;
  },
};

export default profileService;
