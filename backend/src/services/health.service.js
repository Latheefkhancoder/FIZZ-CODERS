/**
 * Health Service
 * Handles health status verification logic
 */

const getHealthStatus = () => {
  return {
    status: "ok",
    service: "FIZZ-CONNECT Backend API",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };
};

module.exports = {
  getHealthStatus,
};
