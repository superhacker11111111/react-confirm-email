import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: null,
  billings: [],
  count: 0,
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
      state.count = Math.ceil(action.payload.count / 10);
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
