const fs = require("fs");
const path = require("path");
const validator = require("validator");
const isEmpty = require("is-empty");

const validateRegisterInput = (data) => {
  let errors = {};
  //Convert empty fields to an empty string so we can use validator functions
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  // data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  //Email Checks
  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!validator.isEmail(data.email)) {
    errors.email = "Email is Invalid";
  }

  //Password Checks
  if (validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  // Password length checks
  else if (
    !validator.isLength(data.password, {
      min: 6,
      max: 30,
    })
  ) {
    errors.password = "Password must be at least 6 characters";
  }

  // // Password2 checks
  // else if (validator.isEmpty(data.password2)) {
  //   errors.password2 = "Confirm Password field is required";
  // }

  // // Password and password2 compares
  // else if (!validator.equals(data.password, data.password2)) {
  //   errors.password2 = "Passwords do not match";
  // }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const validateLoginInput = (data) => {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  //Email Checks
  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!validator.isEmail(data.email)) {
    errors.email = "Email is Invalid";
  }

  //Password Checks
  if (validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const validateResetPasswordInput = (data) => {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.email = !isEmpty(data.email) ? data.email : "";
  data.verifyCode = !isEmpty(data.verifyCode) ? data.verifyCode : "";
  data.newPassword = !isEmpty(data.newPassword) ? data.newPassword : "";
  data.confirmPassword = !isEmpty(data.confirmPassword)
    ? data.confirmPassword
    : "";

  //Email Checks
  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!validator.isEmail(data.email)) {
    errors.email = "Email is Invalid";
  }

  //Password Checks
  if (validator.isEmpty(data.newPassword)) {
    errors.password = "Password field is required";
  }
  // Password length checks
  else if (
    !validator.isLength(data.newPassword, {
      min: 6,
      max: 30,
    })
  ) {
    errors.password = "Password must be at least 6 characters";
  }

  if (validator.isEmpty(data.confirmPassword)) {
    errors.password = "Confirm Password field is required";
  } else if (data.confirmPassword !== data.newPassword) {
    errors.password = "Confirm Password must be equal with New Password";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateResetPasswordInput,
};
