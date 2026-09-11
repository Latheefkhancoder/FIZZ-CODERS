const express = require("express");
const { profileController } = require("../controllers");
const { authenticate, validate } = require("../middleware");
const { validateUpdateProfile } = require("../validators");

const router = express.Router();

router.use(authenticate);

// GET /api/profile
router.get("/", profileController.getProfile);

// PATCH /api/profile
router.patch("/", validate(validateUpdateProfile), profileController.updateProfile);

module.exports = router;
