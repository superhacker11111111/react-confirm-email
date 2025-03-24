import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import setAuthToken from '../../utils/setAuthToken';
// routes

const initialState = {
  isloading: false,
  error: null,
  tags: [],
};

const slice = createSlice({
  name: 'tag',
  initialState,
  reducers: {
    startLoading(state) {
      state.isloading = true;
    },

    hasError(state, action) {
      state.isloading = false;
      state.error = action.payload;
    },

    getTagsSuccess(state, action) {
      state.isloading = false;
      state.tags = action.payload;
    },
  },
});

export default slice.reducer;

export const { getTagsSuccess } = slice.actions;

export const getTags = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.get('/tag');
    dispatch(slice.actions.getTagsSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};
