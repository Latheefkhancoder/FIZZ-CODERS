const { db } = require("../config/firebase");
const { userModel } = require("../models");

const HARDCODED_USERS = [
  { id: "admin-1", name: "Admin User", email: "admin@fizz.com", role: "Admin" },
  { id: "member-1", name: "Team Member", email: "member@fizz.com", role: "Member" },
];

/**
 * User Repository
 * Bridges between the authentication user database and Firestore profile metadata.
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
      let profileExtra = {};
      try {
        const doc = await db.collection("userProfiles").doc(idStr).get();
        if (doc.exists) {
          profileExtra = doc.data();
        }
      } catch {
        // Fallback gracefully
      }

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
        let profileExtra = {};
        try {
          const doc = await db.collection("userProfiles").doc(idStr).get();
          if (doc.exists) {
            profileExtra = doc.data();
          }
        } catch {
          // Fallback gracefully
        }

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
      // User lookup failed or not found in user model
    }

    // Check userProfiles Firestore collection fallback
    try {
      const doc = await db.collection("userProfiles").doc(idStr).get();
      if (doc.exists) {
        return { ...doc.data(), id: doc.id };
      }
    } catch {
      // Fallback
    }

    return null;
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
      let profileExtra = {};
      try {
        const doc = await db.collection("userProfiles").doc(hardcoded.id).get();
        if (doc.exists) {
          profileExtra = doc.data();
        }
      } catch {
        // Fallback gracefully
      }

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
        let profileExtra = {};
        try {
          const doc = await db.collection("userProfiles").doc(String(user.id)).get();
          if (doc.exists) {
            profileExtra = doc.data();
          }
        } catch {
          // Fallback gracefully
        }

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
      // User lookup failed or not found in user model
    }

    try {
      const snapshot = await db.collection("userProfiles")
        .where("email", "==", cleanEmail)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { ...doc.data(), id: doc.id };
      }
    } catch {
      // Fallback
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

    const userIdStr = String(userId);
    const profileRef = db.collection("userProfiles").doc(userIdStr);

    let currentExtra = {};
    try {
      const doc = await profileRef.get();
      if (doc.exists) {
        currentExtra = doc.data();
      }
    } catch {
      // Proceed with empty currentExtra
    }

    const updatedExtra = {
      ...currentExtra,
      id: userIdStr,
      email: existing.email,
      name: updates.name !== undefined ? updates.name.trim() : existing.name,
      bio: updates.bio !== undefined ? updates.bio.trim() : (existing.bio || ""),
      role: existing.role || "Member",
      updatedAt: new Date().toISOString(),
    };

    await profileRef.set(updatedExtra, { merge: true });

    return {
      id: userIdStr,
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
