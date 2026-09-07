const express = require("express");
const { healthController } = require("../controllers");

const router = express.Router();

/**
 * @route GET /api/health
 * @desc  Health check endpoint
 * @access Public
 */
router.get("/health", healthController.getHealth);

module.exports = router;
