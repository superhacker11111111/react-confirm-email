import { createSlice } from '@reduxjs/toolkit';
// utils
import { ALREADY_EXIST, CREATED } from '../../assets/data/resCode';
import axios from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';

const initialState = {
  isloading: false,
  error: null,
  ED: null,
  EDs: [],
  drafts: [],
};

const slice = createSlice({
  name: 'ed',
  initialState,
  reducers: {
    startLoading(state) {
      state.isloading = true;
    },

    hasError(state, action) {
      state.isloading = false;
      state.error = action.payload;
    },

    getEDsSuccess(state, action) {
      state.isloading = false;
      state.EDs = action.payload;
    },

    getDraftsSuccess(state, action) {
      state.isloading = false;
      state.drafts = action.payload;
    },

    getEDSuccess(state, action) {
      state.isloading = false;
      state.ED = action.payload;
    },
  },
});

export default slice.reducer;

export const { getEDsSuccess, getEDSuccess } = slice.actions;

export const getEDs = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get('/ed');
    dispatch(slice.actions.getEDsSuccess(response.data.data.eds));
    dispatch(slice.actions.getDraftsSuccess(response.data.data.drafts));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getED = (id) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`/ed/${id}`);
    dispatch(slice.actions.getEDSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const addED = (edData, Alert, SnackBar) => (dispatch) => {
  axios
    .post('/ed', edData)
    .then((res) => {
      switch (res.data.code) {
        case CREATED:
          Alert();
          break;
        case ALREADY_EXIST:
          SnackBar('The RealityFence is already exist', 'error');
          break;
        default:
          break;
      }
    })
    .catch((err) => {
      dispatch(slice.actions.hasError(err));
    });
};

export const updateED = (id, edData, SnackBar, navigate) => (dispatch) => {
  axios
    .put(`ed/${id}`, edData)
    .then((res) => {
      navigate(PATH_DASHBOARD.general.ED.list);
      SnackBar('Successfully updated!', 'success');
    })
    .catch((err) => {
      dispatch(slice.actions.hasError(err));
    });
};

export const deleteED = (id, Snackbar) => (dispatch) => {
  axios
    .put(`ed/delete/${id}`)
    .then((res) => {
      dispatch(getEDs());
      Snackbar('Succesfully deleted!', 'success');
    })
    .catch((err) => {
      Snackbar('Server Error', {
        variant: 'error',
      });
    });
};
