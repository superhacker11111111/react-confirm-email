import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import setAuthToken from '../../utils/setAuthToken';
// routes

const initialState = {
  isloading: false,
  error: null,
  affiliates: [],
};

const slice = createSlice({
  name: 'affiliate',
  initialState,
  reducers: {
    startLoading(state) {
      state.isloading = true;
    },

    hasError(state, action) {
      state.isloading = false;
      state.error = action.payload;
    },

    getAffiliatesSuccess(state, action) {
      state.isloading = false;
      state.affiliates = action.payload;
    },
  },
});

export default slice.reducer;

export const { getAffiliatesSuccess } = slice.actions;

export const getAffiliates = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    setAuthToken(localStorage.getItem('accessToken'));
    const response = await axios.get(`/leadsource`);
    dispatch(slice.actions.getAffiliatesSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};
