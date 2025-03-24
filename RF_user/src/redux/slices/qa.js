import { createSlice } from '@reduxjs/toolkit';
// utils
import { CREATED } from '../../assets/data/resCode';
import axios from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';

const initialState = {
  isloading: false,
  error: null,
  QA: null,
  QAs: [],
};

const slice = createSlice({
  name: 'qa',
  initialState,
  reducers: {
    startLoading(state) {
      state.isloading = true;
    },

    hasError(state, action) {
      state.isloading = false;
      state.error = action.payload;
    },

    getQAsSuccess(state, action) {
      state.isloading = false;
      state.QAs = action.payload;
    },

    getQASuccess(state, action) {
      state.isloading = false;
      state.QA = action.payload;
    },
  },
});

export default slice.reducer;

export const { getQAsSuccess, getQASuccess } = slice.actions;

export const getQAs = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get('/qa');
    dispatch(slice.actions.getQAsSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getQA = (id) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`/qa/${id}`);
    dispatch(slice.actions.getQASuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const addQA = (qaData, Alert) => (dispatch) => {
  axios
    .post('/qa', qaData)
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

export const updateQA = (id, qaData, SnackBar, navigate) => (dispatch) => {
  axios
    .put(`qa/${id}`, qaData)
    .then((res) => {
      navigate(PATH_DASHBOARD.general.QA.list);
      SnackBar('Successfully updated!', 'success');
    })
    .catch((err) => {
      dispatch(slice.actions.hasError(err));
    });
};

export const deleteQA = (id, Snackbar) => (dispatch) => {
  axios
    .put(`qa/delete/${id}`)
    .then((res) => {
      dispatch(getQAs());
      Snackbar('Succesfully deleted!', 'success');
    })
    .catch((err) => {
      Snackbar('Server Error', {
        variant: 'error',
      });
    });
};
