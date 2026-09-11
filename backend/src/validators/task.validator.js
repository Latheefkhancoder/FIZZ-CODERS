/**
 * Task Validators
 */

const ALLOWED_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const ALLOWED_STATUSES = ["TODO", "IN_PROGRESS", "IN PROGRESS", "DONE"];

const validateCreateTask = (data) => {
  const errors = [];
  const { title, description, priority, dueDate } = data || {};

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    errors.push("Task title is required");
  } else if (title.trim().length > 200) {
    errors.push("Task title must be 200 characters or fewer");
  }

  if (description !== undefined && description !== null && typeof description !== "string") {
    errors.push("Task description must be a string");
  }

  if (priority !== undefined && priority !== null) {
    if (typeof priority !== "string" || !ALLOWED_PRIORITIES.includes(priority.toUpperCase())) {
      errors.push(`Priority must be one of: ${ALLOWED_PRIORITIES.join(", ")}`);
    }
  }

  if (dueDate !== undefined && dueDate !== null && dueDate !== "") {
    if (typeof dueDate !== "string" || isNaN(Date.parse(dueDate))) {
      errors.push("Due date must be a valid date format");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateUpdateTask = (data) => {
  const errors = [];
  const { title, description, priority, status, dueDate } = data || {};

  if (!data || Object.keys(data).length === 0) {
    errors.push("At least one field to update must be provided");
  }

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0) {
      errors.push("Task title cannot be empty");
    } else if (title.trim().length > 200) {
      errors.push("Task title must be 200 characters or fewer");
    }
  }

  if (description !== undefined && description !== null && typeof description !== "string") {
    errors.push("Task description must be a string");
  }

  if (priority !== undefined && priority !== null) {
    if (typeof priority !== "string" || !ALLOWED_PRIORITIES.includes(priority.toUpperCase())) {
      errors.push(`Priority must be one of: ${ALLOWED_PRIORITIES.join(", ")}`);
    }
  }

  if (status !== undefined && status !== null) {
    if (typeof status !== "string" || !ALLOWED_STATUSES.includes(status.toUpperCase())) {
      errors.push(`Status must be one of: TODO, IN_PROGRESS, DONE`);
    }
  }

  if (dueDate !== undefined && dueDate !== null && dueDate !== "") {
    if (typeof dueDate !== "string" || isNaN(Date.parse(dueDate))) {
      errors.push("Due date must be a valid date format");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateUpdateTaskStatus = (data) => {
  const errors = [];
  const { status } = data || {};

  if (!status || typeof status !== "string" || !ALLOWED_STATUSES.includes(status.toUpperCase())) {
    errors.push("Valid status is required (TODO, IN_PROGRESS, DONE)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  ALLOWED_PRIORITIES,
  ALLOWED_STATUSES,
  validateCreateTask,
  validateUpdateTask,
  validateUpdateTaskStatus,
};
