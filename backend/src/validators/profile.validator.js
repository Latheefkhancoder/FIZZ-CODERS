/**
 * Profile Validators
 */

const validateUpdateProfile = (data) => {
  const errors = [];
  const { name, bio } = data || {};

  if (!data || Object.keys(data).length === 0) {
    errors.push("At least one profile field (name or bio) must be provided");
  }

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length === 0) {
      errors.push("Name cannot be empty");
    } else if (name.trim().length > 100) {
      errors.push("Name cannot exceed 100 characters");
    }
  }

  if (bio !== undefined && bio !== null) {
    if (typeof bio !== "string") {
      errors.push("Bio must be a text string");
    } else if (bio.length > 500) {
      errors.push("Bio cannot exceed 500 characters");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateUpdateProfile,
};
