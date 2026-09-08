const errorHandler = require("./errorHandler");
const notFoundHandler = require("./notFoundHandler");
const authenticate = require("./auth.middleware");
const validate = require("./validate");

module.exports = {
  errorHandler,
  notFoundHandler,
  authenticate,
  validate,
};
