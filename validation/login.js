const validator = require("validator");
const isEmpty = require("./is-empty");

// Validation logic for register route

module.exports = data => {
  const errors = {};

  // converting to string so that validator function param type matches
  // this is done for required fields as they need to be verified to be not empty
  const email = !isEmpty(data.email) ? data.email : "";
  const password = !isEmpty(data.password) ? data.password : "";

  // the core validation logic

  // email must be a valid email
  if (!validator.isEmail(email)) {
    errors.email = "Please enter a valid email address";
  }

  // email field must exist
  if (validator.isEmpty(email)) {
    errors.email = "Email field must exist";
  }

  // password must not be empty
  if (validator.isEmpty(password)) {
    errors.password = "Password field must exist";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
