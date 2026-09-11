const authValidator = require("./auth.validator");
const boardValidator = require("./board.validator");
const memberValidator = require("./member.validator");
const taskValidator = require("./task.validator");
const commentValidator = require("./comment.validator");
const chatValidator = require("./chat.validator");
const profileValidator = require("./profile.validator");

module.exports = {
  ...authValidator,
  ...boardValidator,
  ...memberValidator,
  ...taskValidator,
  ...commentValidator,
  ...chatValidator,
  ...profileValidator,
};
