import { createSlice } from '@reduxjs/toolkit';
// utils
import { CREATED } from '../../assets/data/resCode';
import axios from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';

const initialState = {
  isloading: false,
  error: null,
  category: null,
  categories: [],
};

const slice = createSlice({
  name: 'QACategory',
  initialState,
  reducers: {
    startLoading(state) {
      state.isloading = true;
    },

    hasError(state, action) {
      state.isloading = false;
      state.error = action.payload;
    },

    getCategoriesSuccess(state, action) {
      state.isloading = false;
      state.categories = action.payload;
    },

    getCategorySuccess(state, action) {
      state.isloading = false;
      state.category = action.payload;
    },
  },
});

export default slice.reducer;

export const { getCategoriesSuccess, getCategorySuccess } = slice.actions;

export const getQACategories = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get('/qacategory');
    dispatch(slice.actions.getCategoriesSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getQACategory = (id) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`/qacategory/${id}`);
    dispatch(slice.actions.getCategorySuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const addQACategory = (qaData, Alert, reset) => (dispatch) => {
  axios
    .post('/qacategory', qaData)
    .then((res) => {
      switch (res.data.code) {
        case CREATED:
          Alert();
          reset();
          break;
        default:
          break;
      }
    })
    .catch((err) => {
      dispatch(slice.actions.hasError(err));
    });
};

export const updateQACategory = (id, qaData, SnackBar, navigate) => (dispatch) => {
  axios
    .put(`qacategory/${id}`, qaData)
    .then((res) => {
      navigate(PATH_DASHBOARD.general.QA.categorylist);
      SnackBar('Successfully updated!', 'success');
    })
    .catch((err) => {
      dispatch(slice.actions.hasError(err));
    });
};

export const deleteQACategory = (id, Snackbar) => (dispatch) => {
  axios
    .put(`qacategory/delete/${id}`)
    .then((res) => {
      dispatch(getQACategories());
      Snackbar('Succesfully deleted!', 'success');
    })
    .catch((err) => {
      Snackbar('Server Error', {
        variant: 'error',
      });
    });
};
