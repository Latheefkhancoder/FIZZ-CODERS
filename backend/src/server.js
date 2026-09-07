const app = require("./app");
const env = require("./config/env");

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[FIZZ-CONNECT] Server is running on port ${PORT} in ${env.NODE_ENV} mode`);
  console.log(`[FIZZ-CONNECT] Health check available at: http://localhost:${PORT}/api/health`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("[FIZZ-CONNECT] Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("[FIZZ-CONNECT] Uncaught Exception:", err.message);
  process.exit(1);
});
