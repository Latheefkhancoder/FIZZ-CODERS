const express = require("express");
const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const boardRoutes = require("./board.routes");
const taskRoutes = require("./task.routes");
const profileRoutes = require("./profile.routes");

const router = express.Router();

router.use("/", healthRoutes);
router.use("/auth", authRoutes);
router.use("/boards", boardRoutes);
router.use("/tasks", taskRoutes);
router.use("/profile", profileRoutes);

module.exports = router;
