const validator = require("validator");
const isEmpty = require("./is-empty");

// Validation logic for register route

module.exports = data => {
  const errors = {};

  // converting to string so that validator function param type matches
  // this is done for required fields as they need to be verified to be not empty
  const name = !isEmpty(data.name) ? data.name : "";
  const email = !isEmpty(data.email) ? data.email : "";
  const password = !isEmpty(data.password) ? data.password : "";
  const password2 = !isEmpty(data.password2) ? data.password2 : "";

  // the core validation logic

  // name must be between 2 and 100 characters
  if (!validator.isLength(name, { min: 2, max: 100 })) {
    errors.name = "Name must be between 2 and 100 characters";
  }

  // name field must exist
  if (validator.isEmpty(name)) {
    errors.name = "name field must exist";
  }
  // email must be a valid email
  if (!validator.isEmail(email)) {
    errors.email = "Please enter a valid email address";
  }

  // email field must exist
  if (validator.isEmpty(email)) {
    errors.email = "Email field must exist";
  }

  // password must be at least 6 characters long
  if (!validator.isLength(password, { min: 6 })) {
    errors.password = "Password must be at least 6 characters long";
  }

  // password must not be empty
  if (validator.isEmpty(password)) {
    errors.password = "Password field must exist";
  }

  // password2 field must exist
  if (validator.isEmpty(password2)) {
    errors.password2 = "Confirm password field is required";
  }

  // passwords must match
  if (!validator.equals(password, password2)) {
    errors.password2 = "Passwords do not match";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
