const { taskService } = require("../services");
const { successResponse } = require("../utils/response");

/**
 * Task Controller
 */

const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, assignee, dueDate } = req.body;
    const task = await taskService.createTask({
      boardId: req.params.boardId,
      title,
      description,
      priority,
      assignee,
      dueDate,
      creatorId: req.user.id,
      creatorName: req.user.name || "User",
    });
    return successResponse(res, "Task created successfully", task, 201);
  } catch (err) {
    next(err);
  }
};

const getBoardTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getBoardTasks(req.params.boardId, req.query);
    return successResponse(res, "Tasks retrieved successfully", tasks, 200);
  } catch (err) {
    next(err);
  }
};

const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getMyTasks(req.user.id);
    return successResponse(res, "Assigned tasks retrieved successfully", tasks, 200);
  } catch (err) {
    next(err);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.taskId);
    return successResponse(res, "Task retrieved successfully", task, 200);
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(
      req.params.taskId,
      req.body,
      req.user.id,
      req.user.name || "User"
    );
    return successResponse(res, "Task updated successfully", task, 200);
  } catch (err) {
    next(err);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const task = await taskService.updateTaskStatus(
      req.params.taskId,
      status,
      req.user.id,
      req.user.name || "User"
    );
    return successResponse(res, "Task status updated successfully", task, 200);
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.taskId, req.user.id, req.user.name || "User");
    return successResponse(res, "Task deleted successfully", null, 200);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTask,
  getBoardTasks,
  getMyTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
