// routes
import { PATH_DASHBOARD } from './routes/paths';

// API
// ----------------------------------------------------------------------

export const HOST_API_KEY = process.env.REACT_APP_HOST_API_KEY || '';
//
export const STRIPE_ACCOUNT = process.env.REACT_APP_STRIPE_ACCOUNT;
// AWS
export const AWS_ACCESS_KEY_ID = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
export const REGION = process.env.REACT_APP_REGION;
export const AWS_S3_BUCKET = process.env.REACT_APP_AWS_BUCKET;

// Stripe
export const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
export const STRIPE_SECRET_KEY = process.env.REACT_APP_STRIPE_SECRET_KEY;

// Zapier
export const FENCE_REQUEST_WEBHOOK = process.env.REACT_APP_FENCE_REQUEST_WEBHOOK;
export const NEW_CUSTOMER_SIGNUP_WEBHOOK = process.env.REACT_APP_NEW_CUSTOMER_SIGNUP_WEBHOOK;
export const SHOPPER_SIGNUP_WEBHOOK = process.env.REACT_APP_SHOPPER_SIGNUP_WEBHOOK;
export const ADDING_CHILD_USER_WEBHOOK = process.env.REACT_APP_ADDING_CHILD_USER_WEBHOOK;
export const PAUSE_CANCEL_SUBSCRIPTION_WEBHOOK =
  process.env.REACT_APP_PAUSE_CANCEL_SUBSCRIPTION_WEBHOOK;

// Google
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;

// Tapfiliate
export const TAPFILIATE_ACCOUNT_ID = process.env.REACT_APP_TAPFILIATE_ACCOUNT_ID;
// Google Map API Key
export const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
//
export const FIREBASE_API = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const COGNITO_API = {
  userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
  clientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
};

export const AUTH0_API = {
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
};

export const MAP_API = process.env.REACT_APP_MAPBOX_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = PATH_DASHBOARD.user.account;

// LAYOUT

// ----------------------------------------------------------------------

export const HEADER = {
  H_MOBILE: 40,
  H_MAIN_DESKTOP: 88,
  H_DASHBOARD_DESKTOP: 92,
  H_DASHBOARD_DESKTOP_OFFSET: 92 - 32,
};

export const TOOLBAR = {
  H_MOBILE: 64,
  H_MAIN_DESKTOP: 88,
  H_DASHBOARD_DESKTOP: 92,
};

export const NAV = {
  W_BASE: 260,
  W_DRAWER: 280,
  W_DASHBOARD: 280,
  W_DASHBOARD_MINI: 88,
  //
  H_DASHBOARD_ITEM: 48,
  H_DASHBOARD_ITEM_SUB: 36,
  //
  H_DASHBOARD_ITEM_HORIZONTAL: 32,
};

export const ICON = {
  NAV_ITEM: 24,
  NAV_ITEM_HORIZONTAL: 22,
  NAV_ITEM_MINI: 22,
};
