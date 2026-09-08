const { errorResponse } = require("../utils/response");

/**
 * Middleware factory to run validator functions against req.body
 * @param {Function} validatorFn - Validator function returning { isValid, errors }
 */
const validate = (validatorFn) => {
  return (req, res, next) => {
    const { isValid, errors } = validatorFn(req.body);
    if (!isValid) {
      return errorResponse(res, errors[0] || "Validation failed", errors, 400);
    }
    next();
  };
};

module.exports = validate;
