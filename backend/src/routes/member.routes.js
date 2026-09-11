const express = require("express");
const { memberController } = require("../controllers");
const { authenticate, requireBoardAccess, requireBoardAdmin, validate } = require("../middleware");
const { validateAddMember, validateUpdateMemberRole } = require("../validators");

const router = express.Router({ mergeParams: true });

// All member routes require authentication
router.use(authenticate);

// GET /api/boards/:boardId/members
router.get("/", requireBoardAccess, memberController.getMembers);

// POST /api/boards/:boardId/members
router.post("/", requireBoardAdmin, validate(validateAddMember), memberController.addMember);

// PATCH /api/boards/:boardId/members/:userId
router.patch("/:userId", requireBoardAdmin, validate(validateUpdateMemberRole), memberController.updateMemberRole);

// DELETE /api/boards/:boardId/members/:userId
router.delete("/:userId", requireBoardAdmin, memberController.removeMember);

module.exports = router;
