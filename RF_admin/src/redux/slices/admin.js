import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import setAuthToken from '../../utils/setAuthToken';
// routes

const initialState = {
  isloading: false,
  error: null,
  admins: [],
};

const slice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    startLoading(state) {
      state.isloading = true;
    },

    hasError(state, action) {
      state.isloading = false;
      state.error = action.payload;
    },

    getAdminsSuccess(state, action) {
      state.isloading = false;
      state.admins = action.payload;
    },
  },
});

export default slice.reducer;

export const { getAdminsSuccess } = slice.actions;

export const getAdmins = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    setAuthToken(localStorage.getItem('accessToken'));
    const response = await axios.get(`/admin`);
    dispatch(slice.actions.getAdminsSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const addAdmin = (admin, SnackBar, reset) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    setAuthToken(localStorage.getItem('accessToken'));
    await axios.post(`/admin`, admin);
    SnackBar('Successfully added', 'success');
    dispatch(getAdmins());
    reset();
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const deleteAdmin = (id, Snackbar) => async (dispatch) => {
  try {
    setAuthToken(localStorage.getItem('accessToken'));
    await axios.put(`admin/${id}`);
    Snackbar('Successfully removed', 'success');
    dispatch(getAdmins());
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const createPassword = (passwordData, SnackBar) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    setAuthToken(localStorage.getItem('accessToken'));
    await axios.post(`/admin/createPassword`, passwordData);
    SnackBar('Success', 'success');
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};
