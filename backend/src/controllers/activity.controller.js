const { activityService } = require("../services");
const { successResponse } = require("../utils/response");

/**
 * Activity Log Controller
 */

const getActivityLogs = async (req, res, next) => {
  try {
    const logs = await activityService.getBoardActivities(req.params.boardId);
    return successResponse(res, "Activity logs retrieved successfully", logs, 200);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getActivityLogs,
};
