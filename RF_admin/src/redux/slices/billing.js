import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

const initialState = {
  isloading: false,
  error: null,
  billings: [],
  billingdetail: null,
};

const slice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    startLoading(state) {
      state.isloading = true;
    },

    hasError(state, action) {
      state.isloading = false;
      state.error = action.payload;
    },

    getBillingsSuccess(state, action) {
      state.isloading = false;
      state.billings = action.payload.rows;
    },
    getBillingDetailSuccess(state, action) {
      state.isloading = false;
      state.billingdetail = action.payload;
    },
  },
});

export default slice.reducer;

export const { getBillingsSuccess } = slice.actions;

export const getBillings = (data) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.post('/payment/billing', data);
    dispatch(slice.actions.getBillingsSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getBillingDetail = (data) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.post('/payment/billing/detail', data);
    dispatch(slice.actions.getBillingDetailSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};
