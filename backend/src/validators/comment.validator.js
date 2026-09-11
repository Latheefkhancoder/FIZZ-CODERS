/**
 * Comment Validators
 */

const validateCreateComment = (data) => {
  const errors = [];
  const { text } = data || {};

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    errors.push("Comment text is required");
  } else if (text.trim().length > 2000) {
    errors.push("Comment cannot exceed 2000 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateCreateComment,
};
