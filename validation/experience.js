const validator = require("validator");
const isEmpty = require("./is-empty");

// Validation logic for register route

module.exports = data => {
  const errors = {};
  // converting to string so that validator function param type matches
  // this is done for required fields as they need to be verified to be not empty
  const title = !isEmpty(data.title) ? data.title : "";
  const company = !isEmpty(data.company) ? data.company : "";
  const from = !isEmpty(data.from) ? data.from : "";
  // the core validation logic

  // title field must exist
  if (validator.isEmpty(title)) {
    errors.title = "Title field must exist";
  }

  // company field must exist
  if (validator.isEmpty(company)) {
    errors.company = "Company field must exist";
  }

  // from field must exist
  if (validator.isEmpty(from)) {
    errors.from = "From date field must exist";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
