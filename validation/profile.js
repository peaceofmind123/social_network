const validator = require("validator");
const isEmpty = require("./is-empty");

// Validation logic for register route

let errors = {};

module.exports = data => {
  // converting to string so that validator function param type matches
  //required fields
  const handle = !isEmpty(data.handle) ? data.handle : "";
  const status = !isEmpty(data.status) ? data.status : "";
  const skills = !isEmpty(data.skills) ? data.skills : "";

  // the core validation logic
  // for required fields
  if (validator.isEmpty(handle)) {
    errors.handle = "Handle field is required";
  }

  if (validator.isEmpty(status)) {
    errors.status = "Status field is required";
  }

  if (validator.isEmpty(skills)) {
    errors.skills = "Skills field is required";
  }

  // special checks
  if (!validator.isLength(handle, { min: 2, max: 40 })) {
    errors.handle = "Handle must be between 2 and 40 characters long";
  }

  // url checks
  if (!isEmpty(data.website)) {
    if (!validator.isURL(data.website)) {
      errors.website = "Not a valid url";
    }
  }

  if (!isEmpty(data.instagram)) {
    if (!validator.isURL(data.instagram)) {
      errors.instagram = "Not a valid url";
    }
  }

  if (!isEmpty(data.twitter)) {
    if (!validator.isURL(data.twitter)) {
      errors.twitter = "Not a valid url";
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!validator.isURL(data.facebook)) {
      errors.facebook = "Not a valid url";
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!validator.isURL(data.linkedin)) {
      errors.linkedin = "Not a valid url";
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!validator.isURL(data.youtube)) {
      errors.youtube = "Not a valid url";
    }
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
