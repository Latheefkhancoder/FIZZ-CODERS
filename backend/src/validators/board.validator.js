/**
 * Board Validators
 */

const validateCreateBoard = (data) => {
  const errors = [];
  const { name, code } = data || {};

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("Board name is required");
  } else if (name.trim().length < 2 || name.trim().length > 100) {
    errors.push("Board name must be between 2 and 100 characters");
  }

  if (!code || typeof code !== "string" || code.trim().length === 0) {
    errors.push("Board code is required");
  } else if (!/^[A-Za-z0-9]{5}$/.test(code.trim())) {
    errors.push("Board code must be exactly 5 alphanumeric characters (A-Z, 0-9)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateJoinBoard = (data) => {
  const errors = [];
  const { code } = data || {};

  if (!code || typeof code !== "string" || code.trim().length === 0) {
    errors.push("Board code is required");
  } else if (!/^[A-Za-z0-9]{5}$/.test(code.trim())) {
    errors.push("Board code must be exactly 5 alphanumeric characters (A-Z, 0-9)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateCreateBoard,
  validateJoinBoard,
};
