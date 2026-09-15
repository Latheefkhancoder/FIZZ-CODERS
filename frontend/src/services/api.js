const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Retrieve the current JWT auth token from persistent or session storage
 */
export const getAuthToken = () => {
  return (
    localStorage.getItem('fizz_token') ||
    sessionStorage.getItem('fizz_token') ||
    localStorage.getItem('auth_token') ||
    sessionStorage.getItem('auth_token') ||
    ''
  );
};

/**
 * Handle API responses, extracting payload data or throwing standardized errors
 */
const handleResponse = async (response) => {
  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const errorMsg = data.message || (data.errors && data.errors[0]) || 'An unexpected error occurred.';
    const error = new Error(errorMsg);
    error.status = response.status;
    error.errors = data.errors || [];
    error.data = data;
    throw error;
  }

  return data;
};

/**
 * Core HTTP request helper with automatic JWT injection
 */
export const request = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  return handleResponse(response);
};

export const api = {
  get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) => request(endpoint, { method: 'POST', body, ...options }),
  patch: (endpoint, body, options) => request(endpoint, { method: 'PATCH', body, ...options }),
  delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options }),
};

export default api;
