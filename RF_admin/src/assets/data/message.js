// ERROR MESSAGES
const USRE_NOT_EXITS = 'the user does not exist.';
const PASSWORD_INCORRECT = 'password is incorrect';
const USER_IS_BANNED = ' the user has been banned';
const EMAIL_PASSWORD_REQUIRED = 'the email or password is required';
const USER_NOT_VERIFIED = 'the user is not verified';
const VALIDATION_ERROR = 'validation Error';
const EMAIL_ALREADY_EXIST = 'email already exists!';
const EMAIL_NO_EXIST = 'email does not exist.';
const CONFIRM_PASSWORD_INCORRECT = 'new password and confirm password must match.';
const CODE_INCORRECT = 'the code is incorrect.';
const SERVER_ERROR = 'internal Server Error.';
const CONFIRM_PAYMENT_USER_EXIST =
  'please confirm your payment and user creation has been successful.';

const PAYPAL_NOT_SUPPORTED = 'paypal is not supported yet';
const CARD_HOLDERNAME_REQUIRED = 'card Holder Name is a required field';
const REQUEST_FAILED_TRY_AGAIN = 'vour request is failed. Please check information and try again';
// const = '';

// SUCCESS MESSAGES
const USER_REGISTER = 'the user has been registered successfully.';
const USER_UPDATED = 'the user has been updated successfully.';
const USER_CREATED = 'the user has been created successfully.';
const VERIFY_SUCCESS = 'verification successful.';
const VERIFICATION_SENT = 'verification request has been sent successfully.';
const VERIFICATION_RESENT = 'verification requst have been resent successfully';
const PASSWORD_CHAANGED = 'the password has been updated successfully.';
const PASSWORD_CREATED = 'the password has been created successfully.';

const COMPANY_ADDED = 'the company has been added successfully.';
const COMPANY_DELETED = 'the company has been deleted successfSully.';
const USER_DELETED = 'the user has beed deleted successfully!';
const USERS_DELETED = 'the selected users have been deleted successfully!';

// SYSTEM ALERT

const CHECK_CONNECTION = 'please check your internet connection.';

// MESSAGE TYPE
const ERROR = 'error';
const SUCCESS = 'success';

module.exports = {
  // MESSAGE TYPE
  ERROR,
  SUCCESS,

  // ERROR MESSAGES
  USRE_NOT_EXITS,
  PASSWORD_INCORRECT,
  USER_IS_BANNED,
  EMAIL_PASSWORD_REQUIRED,
  USER_NOT_VERIFIED,
  VALIDATION_ERROR,
  EMAIL_ALREADY_EXIST,
  EMAIL_NO_EXIST,
  CONFIRM_PASSWORD_INCORRECT,
  CODE_INCORRECT,
  SERVER_ERROR,
  CONFIRM_PAYMENT_USER_EXIST,

  PAYPAL_NOT_SUPPORTED,
  CARD_HOLDERNAME_REQUIRED,
  REQUEST_FAILED_TRY_AGAIN,

  // SUCCESS MESSAGES
  USER_REGISTER,
  USER_UPDATED,
  USER_CREATED,
  USER_DELETED,
  USERS_DELETED,
  VERIFY_SUCCESS,
  PASSWORD_CREATED,
  PASSWORD_CHAANGED,
  VERIFICATION_SENT,
  VERIFICATION_RESENT,

  COMPANY_ADDED,
  COMPANY_DELETED,

  // SYSTEM ALERT
  CHECK_CONNECTION,
};
