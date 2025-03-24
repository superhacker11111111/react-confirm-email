import { createSlice } from '@reduxjs/toolkit';
// utils
import { CREATED } from '../../assets/data/resCode';
import axios from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';

const initialState = {
  isloading: false,
  error: null,
  subscription: null,
  originSubscription: null,
  subscriptions: [],
};

const slice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    startLoading(state) {
      state.isloading = true;
    },

    hasError(state, action) {
      state.isloading = false;
      state.error = action.payload;
    },

    getSubscriptionsSuccess(state, action) {
      state.isloading = false;
      state.subscriptions = action.payload;
    },

    getSubscriptionSuccess(state, action) {
      state.isloading = false;
      state.subscription = action.payload;
    },
    getOriginSubscriptionSuccess(state, action) {
      state.isloading = false;
      state.originSubscription = action.payload;
    },
  },
});

export default slice.reducer;

export const { getSubscriptionsSuccess, getSubscriptionSuccess, getOriginSubscriptionSuccess } =
  slice.actions;

export const getSubscriptions = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get('/subscription');
    const subscriptionList = response.data.data;
    if (subscriptionList && subscriptionList.length > 0) {
      subscriptionList.sort((a, b) => parseInt(a.price, 10) - parseInt(b.price, 10));
    }
    dispatch(slice.actions.getSubscriptionsSuccess(subscriptionList));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getSubscription = (id) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`/subscription/${id}`);
    dispatch(slice.actions.getSubscriptionSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getOriginSubscription = (id) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`/subscription/${id}`);
    dispatch(slice.actions.getOriginSubscriptionSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const addSubscription = (subscriptionData, Alert) => (dispatch) => {
  axios
    .post('/subscription', subscriptionData)
    .then((res) => {
      switch (res.data.code) {
        case CREATED:
          Alert();
          break;
        default:
          break;
      }
    })
    .catch((err) => {
      dispatch(slice.actions.hasError(err));
    });
};

export const updateSubscription = (id, subscriptionData, SnackBar, navigate) => (dispatch) => {
  axios
    .put(`subscription/${id}`, subscriptionData)
    .then((res) => {
      navigate(PATH_DASHBOARD.general.subscription.list);
      SnackBar('Successfully updated!', 'success');
    })
    .catch((err) => {
      dispatch(slice.actions.hasError(err));
    });
};

export const deleteSubscription = (id, Snackbar) => (dispatch) => {
  axios
    .put(`subscription/delete/${id}`)
    .then((res) => {
      dispatch(getSubscriptions());
      Snackbar('Succesfully deleted!', 'success');
    })
    .catch((err) => {
      Snackbar('Server Error', {
        variant: 'error',
      });
    });
};
