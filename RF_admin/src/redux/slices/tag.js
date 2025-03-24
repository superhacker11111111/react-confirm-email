import { createSlice } from '@reduxjs/toolkit';
// utils
import { SUCCESS } from '../../assets/data/resCode';
import axios from '../../utils/axios';
import setAuthToken from '../../utils/setAuthToken';

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

export const getTags = (keyword) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.get(`/tag${keyword ? `?keyword=${keyword}` : ''}`);
    dispatch(slice.actions.getTagsSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const updateTag = (tagData, Snackbar) => (dispatch) => {
  axios
    .put(`/tag`, tagData)
    .then((res) => {
      switch (res.data.code) {
        case SUCCESS:
          Snackbar('The tags updated succesfully!', 'success');
          break;
        default:
          break;
      }
    })
    .catch((err) => {
      dispatch(slice.actions.hasError(err));
    });
};
