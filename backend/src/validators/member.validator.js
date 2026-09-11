/**
 * Member Validators
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateAddMember = (data) => {
  const errors = [];
  const { email, role } = data || {};

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    errors.push("A valid email address is required");
  }

  if (role !== undefined && role !== "Admin" && role !== "Member") {
    errors.push("Member role must be either 'Admin' or 'Member'");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateUpdateMemberRole = (data) => {
  const errors = [];
  const { role } = data || {};

  if (!role || (role !== "Admin" && role !== "Member")) {
    errors.push("Role must be either 'Admin' or 'Member'");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateAddMember,
  validateUpdateMemberRole,
};
