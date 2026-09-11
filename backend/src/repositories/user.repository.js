const { userModel } = require("../models");
const memoryStore = require("./memoryStore");

const HARDCODED_USERS = [
  { id: "admin-1", name: "Admin User", email: "admin@fizz.com", role: "Admin" },
  { id: "member-1", name: "Team Member", email: "member@fizz.com", role: "Member" },
];

/**
 * User Repository
 * Bridges between the authentication user database and in-memory profile metadata.
 */
class UserRepository {
  /**
   * Find user by unique ID
   * @param {string|number} id
   * @returns {Promise<object|null>}
   */
  async findById(id) {
    if (!id) return null;
    const idStr = String(id);

    // Check hardcoded auth accounts (for tests and dev accounts)
    const hardcoded = HARDCODED_USERS.find((u) => u.id === idStr);
    if (hardcoded) {
      const profileExtra = memoryStore.userProfiles.get(idStr) || {};
      return {
        id: hardcoded.id,
        name: profileExtra.name || hardcoded.name,
        email: hardcoded.email,
        role: profileExtra.role || hardcoded.role || "Admin",
        bio: profileExtra.bio || "",
        createdAt: new Date().toISOString(),
      };
    }

    try {
      const user = await userModel.findById(id);
      if (user) {
        const profileExtra = memoryStore.userProfiles.get(idStr) || {};
        return {
          id: String(user.id),
          name: profileExtra.name || user.name,
          email: user.email,
          role: profileExtra.role || user.role || "Member",
          bio: profileExtra.bio || "",
          createdAt: user.created_at || user.createdAt,
        };
      }
    } catch {
      // Database error or non-integer ID in PostgreSQL
    }

    // Check memoryStore fallback
    const profileExtra = memoryStore.userProfiles.get(idStr);
    return profileExtra || null;
  }

  /**
   * Find user by email address
   * @param {string} email
   * @returns {Promise<object|null>}
   */
  async findByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();

    // Check hardcoded accounts
    const hardcoded = HARDCODED_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
    if (hardcoded) {
      const profileExtra = memoryStore.userProfiles.get(hardcoded.id) || {};
      return {
        id: hardcoded.id,
        name: profileExtra.name || hardcoded.name,
        email: hardcoded.email,
        role: profileExtra.role || hardcoded.role || "Admin",
        bio: profileExtra.bio || "",
        createdAt: new Date().toISOString(),
      };
    }

    try {
      const user = await userModel.findByEmail(cleanEmail);
      if (user) {
        const profileExtra = memoryStore.userProfiles.get(String(user.id)) || {};
        return {
          id: String(user.id),
          name: profileExtra.name || user.name,
          email: user.email,
          role: profileExtra.role || user.role || "Member",
          bio: profileExtra.bio || "",
          createdAt: user.created_at || user.createdAt,
        };
      }
    } catch {
      // Database error
    }

    for (const profile of memoryStore.userProfiles.values()) {
      if (profile.email && profile.email.toLowerCase() === cleanEmail) {
        return profile;
      }
    }
    return null;
  }

  /**
   * Update profile information for a user
   * @param {string|number} userId
   * @param {object} updates
   * @param {string} [updates.name]
   * @param {string} [updates.bio]
   * @returns {Promise<object>}
   */
  async updateProfile(userId, updates) {
    const existing = await this.findById(userId);
    if (!existing) {
      throw new Error("User not found");
    }

    const currentExtra = memoryStore.userProfiles.get(String(userId)) || {};
    const updatedExtra = {
      ...currentExtra,
      id: String(userId),
      email: existing.email,
      name: updates.name !== undefined ? updates.name.trim() : existing.name,
      bio: updates.bio !== undefined ? updates.bio.trim() : (existing.bio || ""),
      role: existing.role || "Member",
      updatedAt: new Date().toISOString(),
    };

    memoryStore.userProfiles.set(String(userId), updatedExtra);

    return {
      id: String(userId),
      name: updatedExtra.name,
      email: existing.email,
      role: updatedExtra.role,
      bio: updatedExtra.bio,
      initials: (updatedExtra.name || "U")[0].toUpperCase(),
      updatedAt: updatedExtra.updatedAt,
    };
  }
}

module.exports = new UserRepository();
