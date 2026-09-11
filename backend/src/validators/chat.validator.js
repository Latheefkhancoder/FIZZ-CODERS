/**
 * Chat Validators
 */

const validateSendChatMessage = (data) => {
  const errors = [];
  const { text } = data || {};

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    errors.push("Chat message text is required");
  } else if (text.trim().length > 2000) {
    errors.push("Chat message cannot exceed 2000 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateSendChatMessage,
};
