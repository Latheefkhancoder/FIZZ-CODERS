const { userRepository } = require("../repositories");

/**
 * Profile Service
 * Manages user profile retrieval and updates.
 */
class ProfileService {
  /**
   * Get authenticated user profile
   * @param {string|number} userId
   * @returns {Promise<object>}
   */
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error("User profile not found");
      error.statusCode = 404;
      throw error;
    }

    const name = user.name || "User";
    return {
      id: String(user.id),
      name,
      email: user.email,
      role: user.role || "Member",
      bio: user.bio || "",
      initials: name.trim()[0].toUpperCase(),
    };
  }

  /**
   * Update user profile
   * @param {string|number} userId
   * @param {object} updates
   * @param {string} [updates.name]
   * @param {string} [updates.bio]
   * @returns {Promise<object>}
   */
  async updateProfile(userId, updates) {
    return userRepository.updateProfile(userId, updates);
  }
}

module.exports = new ProfileService();
