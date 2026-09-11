const { profileService } = require("../services");
const { successResponse } = require("../utils/response");

/**
 * Profile Controller
 */

const getProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getProfile(req.user.id);
    return successResponse(res, "Profile retrieved successfully", profile, 200);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const profile = await profileService.updateProfile(req.user.id, req.body);
    return successResponse(res, "Profile updated successfully", profile, 200);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
