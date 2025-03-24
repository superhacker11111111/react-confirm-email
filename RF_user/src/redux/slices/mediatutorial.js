import { createSlice } from '@reduxjs/toolkit';
// utils
import { ALREADY_EXIST, CREATED } from '../../assets/data/resCode';
import axios from '../../utils/axios';
import setAuthToken from '../../utils/setAuthToken';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';

const initialState = {
  isloading: false,
  error: null,
  mediaMarketing: null,
  mediaTutorial: null,
  mediaMarketings: [],
  mediaTutorials: [],
};

const slice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    startLoading(state) {
      state.isloading = true;
    },

    hasError(state, action) {
      state.isloading = false;
      state.error = action.payload;
    },

    getMediaMarketingSuccess(state, action) {
      state.isloading = false;
      state.mediaMarketing = action.payload;
    },
    getMediasMarketingSuccess(state, action) {
      state.isloading = false;
      state.mediaMarketings = action.payload;
    },
    getMediaTutorialsSuccess(state, action) {
      state.isloading = false;
      state.mediaTutorials = action.payload;
    },
    getMediaTutorialSuccess(state, action) {
      state.isloading = false;
      state.mediaTutorial = action.payload;
    },
  },
});

export default slice.reducer;

export const { getMediaMarketingSuccess, getMediaTutorialSuccess } = slice.actions;

export const getMarketingMedias = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get('/media/mediaMarketing/');
    dispatch(slice.actions.getMediasMarketingSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getTutorialMedias = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get('/media/mediaTutorial/');
    dispatch(slice.actions.getMediaTutorialsSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};
