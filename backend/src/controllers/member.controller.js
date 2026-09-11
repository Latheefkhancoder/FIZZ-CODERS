const { memberService } = require("../services");
const { successResponse } = require("../utils/response");

/**
 * Member Controller
 */

const getMembers = async (req, res, next) => {
  try {
    const members = await memberService.getBoardMembers(req.params.boardId);
    return successResponse(res, "Members retrieved successfully", members, 200);
  } catch (err) {
    next(err);
  }
};

const addMember = async (req, res, next) => {
  try {
    const { email, role } = req.body;
    const member = await memberService.addMember({
      boardId: req.params.boardId,
      email,
      role,
      actorUserId: req.user.id,
      actorName: req.user.name || "Admin",
    });
    return successResponse(res, "Member added successfully", member, 201);
  } catch (err) {
    next(err);
  }
};

const updateMemberRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const member = await memberService.updateMemberRole({
      boardId: req.params.boardId,
      targetUserId: req.params.userId,
      newRole: role,
      actorUserId: req.user.id,
      actorName: req.user.name || "Admin",
    });
    return successResponse(res, "Member role updated successfully", member, 200);
  } catch (err) {
    next(err);
  }
};

const removeMember = async (req, res, next) => {
  try {
    await memberService.removeMember({
      boardId: req.params.boardId,
      targetUserId: req.params.userId,
      actorUserId: req.user.id,
      actorName: req.user.name || "Admin",
    });
    return successResponse(res, "Member removed successfully", null, 200);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMembers,
  addMember,
  updateMemberRole,
  removeMember,
};
