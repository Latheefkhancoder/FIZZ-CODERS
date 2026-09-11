/**
 * Centralized In-Memory Data Store for FIZZ-CONNECT development persistence.
 *
 * Designed with a clean document-oriented storage model so repositories can
 * later be swapped with Firebase/Firestore collections without changing
 * controllers or services.
 *
 * Contains NO fake / seed / synthetic data. All collections start empty.
 */

class MemoryStore {
  constructor() {
    this.boards = new Map();
    this.members = new Map();
    this.tasks = new Map();
    this.comments = new Map();
    this.activityLogs = new Map();
    this.chatMessages = new Map();
    this.userProfiles = new Map();
  }

  /**
   * Reset all collections (primarily used in tests)
   */
  clear() {
    this.boards.clear();
    this.members.clear();
    this.tasks.clear();
    this.comments.clear();
    this.activityLogs.clear();
    this.chatMessages.clear();
    this.userProfiles.clear();
  }
}

// Export singleton instance
const memoryStore = new MemoryStore();

module.exports = memoryStore;
