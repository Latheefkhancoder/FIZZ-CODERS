/**
 * Status and Priority Normalization & Display Helpers
 * Bridges UI labels with Canonical Backend API values.
 */

// Canonical UI status list
export const UI_STATUSES = ['TODO', 'IN PROGRESS', 'DONE'];

// Canonical UI priority list
export const UI_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

/**
 * Convert UI status to backend canonical status
 * 'IN PROGRESS' -> 'IN_PROGRESS'
 */
export const toApiStatus = (uiStatus) => {
  if (!uiStatus) return 'TODO';
  const clean = uiStatus.trim().toUpperCase();
  if (clean === 'IN PROGRESS') return 'IN_PROGRESS';
  return clean;
};

/**
 * Convert backend canonical status to UI display status
 * 'IN_PROGRESS' -> 'IN PROGRESS'
 */
export const toUiStatus = (apiStatus) => {
  if (!apiStatus) return 'TODO';
  const clean = apiStatus.trim().toUpperCase();
  if (clean === 'IN_PROGRESS') return 'IN PROGRESS';
  return clean;
};

/**
 * Convert UI priority to backend canonical priority
 * 'High' -> 'HIGH'
 */
export const toApiPriority = (uiPriority) => {
  if (!uiPriority) return 'MEDIUM';
  return uiPriority.trim().toUpperCase();
};

/**
 * Convert backend canonical priority to UI display priority
 * 'HIGH' -> 'High'
 */
export const toUiPriority = (apiPriority) => {
  if (!apiPriority) return 'Medium';
  const upper = apiPriority.trim().toUpperCase();
  switch (upper) {
    case 'LOW':
      return 'Low';
    case 'MEDIUM':
      return 'Medium';
    case 'HIGH':
      return 'High';
    case 'URGENT':
      return 'Urgent';
    default:
      return upper.charAt(0) + upper.slice(1).toLowerCase();
  }
};

/**
 * Normalize an entire task object from API format to UI format
 */
export const normalizeTaskForUi = (task) => {
  if (!task) return null;
  return {
    ...task,
    status: toUiStatus(task.status),
    priority: toUiPriority(task.priority),
    comments: Array.isArray(task.comments) ? task.comments : [],
  };
};

/**
 * Format timestamp into standard readable date
 */
export const formatDate = (isoString) => {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
};
