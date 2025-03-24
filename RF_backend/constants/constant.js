const DEFAULT_PASSWORD = "12345678";
const Roles = {
  ADMIN: 0,
  COMPANY: 1,
  SHOPPER: 2,
};
const UserType = {
  PRO: 1,
  PROPLUS: 2,
  ENTERPRISE: 3,
  "FREE TRIAL": 4,
  BASIC: 5,
};

const MemberType = {
  TRIAL: "Trial",
  SUBSCRIBE: "Subscribe",
};

const DEFAULT_IS_DELETED = false;
const USER_STATUS = {
  ACTIVE: true,
  DEACTIVE: false,
};
const DEFAULT_VERIFIED = true;

const Type = {
  NORMAL: 0,
  SOCIAL: 1,
};
const DEFAULT_AVATAR = "";
const DEFAULT_CURRENCY = "usd";
const DEFAULT_PRICE_TYPE = "month";
const PRODUCT_STATUS = {
  Pending: 0,
  Active: 1,
};

const FENCE_STATUS = {
  NOT_STARTED: "1",
  PENDING: "2",
  COMPLETE: "3",
  MODELING: "4",
};

const MediaType = {
  marketingVideo: "1",
  tutorialVideo: "2",
  galleryImage: "3",
};

const DEFAULT_SEARCH_PARAMS = {
  PAGE_SIZE: 5,
  PAGE_NUMBER: 1,
  SORT_ORDER: "DESC",
  SORT_FILED: "createAt",
  FILTER: "all",
};

const SUBSCRIPTION_STATUS = {
  CANCELLED: "canceled",
  PAUSE: "paused",
  ACTIVE: "active",
  NO_SUBSCRIPTION: "No Subscription",
};

const PAYMENT_TYPE = {
  MONTHLY: 0,
  YEARLY: 1,
};

const NotificationSetting = {
  billingInfo: true,
  accountActivity: true,
  news: true,
  productUpdate: true,
  blogPost: true,
  fenceRequest: true,
};

const EMAIL_TYPE = {
  SIGN_UP_VERIFY_EMAIL: "signup_verify_email",
  SIGNUP_EMAIL: "signup_email",
  UPGRADE_SUBSCRIPTION: "upgrade_subscription",
  DOWNGRADE_SUBSCRIPTION: "downgrade_subscription",
};

const BROADCAST_TYPE = {
  EMAIL: "1",
  SMS: "2",
};

module.exports = {
  DEFAULT_PASSWORD,
  Roles,
  UserType,
  DEFAULT_VERIFIED,
  DEFAULT_IS_DELETED,
  DEFAULT_CURRENCY,
  DEFAULT_AVATAR,
  USER_STATUS,
  Type,
  DEFAULT_PRICE_TYPE,
  PRODUCT_STATUS,
  MediaType,
  FENCE_STATUS,
  DEFAULT_SEARCH_PARAMS,
  SUBSCRIPTION_STATUS,
  PAYMENT_TYPE,
  BROADCAST_TYPE,
  NotificationSetting,
  EMAIL_TYPE,
  MemberType,
};
