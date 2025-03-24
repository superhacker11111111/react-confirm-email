import { createSlice } from '@reduxjs/toolkit';
// utils
import { INTERNAL_SERVER_ERROR, SUCCESS } from '../../assets/data/resCode';
import axios from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';

const initialState = {
  isloading: false,
  error: null,
  fence: [],
  fenceDetail: {},
  fences: [],
  drafts: [],
  selectableElements: [],
  selectable: 1,
  count: 0,
};

const slice = createSlice({
  name: 'fence',
  initialState,
  reducers: {
    startLoading(state) {
      state.isloading = true;
    },

    hasError(state, action) {
      state.isloading = false;
      state.error = action.payload;
    },

    getFencesSuccess(state, action) {
      state.isloading = false;
      state.fences = action.payload;
    },

    getDraftsSuccess(state, action) {
      state.isloading = false;
      state.drafts = action.payload;
    },

    getfenceSuccess(state, action) {
      state.isloading = false;
      state.fence = action.payload;
    },

    getfenceDetailSuccess(state, action) {
      state.isloading = false;
      state.fenceDetail = action.payload;
    },
  },
});

export default slice.reducer;

export const { getFencesSuccess, getDraftsSuccess, getfenceSuccess } = slice.actions;

export const getFences = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get('/products');
    dispatch(slice.actions.getFencesSuccess(response.data));
    dispatch(slice.actions.getDraftsSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getFence = (id) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`/products/${id}`);
    dispatch(slice.actions.getfenceSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getFenceByid = (fileId) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`/products/${fileId}`);
    dispatch(slice.actions.getfenceDetailSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getFenceFilter = (keyword) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`/products?keyword=${keyword}`);
    dispatch(slice.actions.getFencesSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const updateFence = (id, fenceData, Snackbar, navigate) => async (dispatch) => {
  axios
    .put(`products/${id}`, fenceData)
    .then((res) => {
      navigate(PATH_DASHBOARD.general.fileManager);
      Snackbar('Successfully updated fence', 'success');
    })
    .catch((err) => {
      dispatch(slice.actions.hasError(err));
      Snackbar('Failed to update fence', 'error');
    });
};

export const deleteFence = (id, Snackbar) => async (dispatch) => {
  axios
    .delete(`fence/delete/${id}`)
    .then((res) => {
      dispatch(getFence());
      Snackbar('Successfully deleted fence', 'success');
    })
    .catch((err) => {
      dispatch(slice.actions.hasError(err));
      Snackbar('Failed to delete fence', 'error');
    });
};

export const getStylesByName = (data) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.post('/category/styles/', data);
    dispatch(slice.actions.getfenceSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getSearchFencesByName = (fileId) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`/products/findby/${fileId}`);
    dispatch(slice.actions.getfenceSuccess(response.data.data.product));
    return response;
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    throw error; // Add this line to throw the error and return it
  }
};

export const getVisibleFences = (params) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  axios
    .get(`/products/getFences/visible?${params}`)
    .then((res) => {
      switch (res.data.code) {
        case SUCCESS:
          dispatch(slice.actions.getFencesSuccess(res.data));
          break;
        case INTERNAL_SERVER_ERROR:
          dispatch(slice.actions.hasError(res.data.message));
          break;
        default:
          break;
      }
    })
    .catch((err) => {
      dispatch(slice.actions.hasError(err));
    });
};
