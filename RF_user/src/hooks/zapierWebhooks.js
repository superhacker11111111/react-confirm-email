import {
  FENCE_REQUEST_WEBHOOK,
  NEW_CUSTOMER_SIGNUP_WEBHOOK,
  SHOPPER_SIGNUP_WEBHOOK,
  ADDING_CHILD_USER_WEBHOOK,
  PAUSE_CANCEL_SUBSCRIPTION_WEBHOOK,
} from '../config-global';

export const confirmFenceRequestWebhook = async (user, requestList) => {
  fetch(FENCE_REQUEST_WEBHOOK, {
    method: 'post',
    body: {
      user,
      requestData: requestList,
    },
  });
};

export const confirmNewCustomerSignupWebhook = async (data) => {
  fetch(NEW_CUSTOMER_SIGNUP_WEBHOOK, {
    method: 'post',
    body: data,
  });
};

export const confirmShopperSignupWebhook = async (data) => {
  fetch(SHOPPER_SIGNUP_WEBHOOK, {
    method: 'post',
    body: data,
  });
};

export const confirmAddingChildUserWebhook = async (data) => {
  fetch(ADDING_CHILD_USER_WEBHOOK, {
    method: 'post',
    body: data,
  });
};

export const confirmPauseCancelSubscriptionWebhook = async (data) => {
  fetch(PAUSE_CANCEL_SUBSCRIPTION_WEBHOOK, {
    method: 'post',
    body: data,
  });
};
