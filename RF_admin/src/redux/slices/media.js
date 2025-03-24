import { createSlice } from '@reduxjs/toolkit';
// utils
import { SUCCESS } from '../../assets/data/resCode';
import axios from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';

const initialState = {
  isloading: false,
  error: null,
  video: {
    marketing: '',
    tutorial: '',
  },
  gallery: [],
  totalCount: 0,
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

    getMediaGallerySuccess(state, action) {
      state.isloading = false;
      state.gallery = action.payload.images;
      state.totalCount = action.payload.totalCount;
    },

    getMediaVideoSuccess(state, action) {
      state.isloading = false;
      state.video = {
        marketing: action.payload.marketingURL,
        tutorial: action.payload.tutorialURL,
      };
    },
  },
});

export default slice.reducer;

export const { getMediaGallerySuccess, getMediaVideoSuccess } = slice.actions;

export const CreateOrUpdateVideo = (videoData, Snackbar, navigate) => (dispatch) => {
  axios
    .post('/media/video', videoData)
    .then((res) => {
      switch (res.data.code) {
        case SUCCESS:
          dispatch(getVideos());
          navigate(PATH_DASHBOARD.general.media.root);
          Snackbar('Succesfully Updated!', 'success');
          break;
        default:
          break;
      }
    })
    .catch((err) => {
      Snackbar('Server Error', 'error');
    });
};

export const getVideos = () => (dispatch) => {
  axios
    .get('/media/video')
    .then((res) => {
      switch (res.data.code) {
        case SUCCESS:
          dispatch(slice.actions.getMediaVideoSuccess(res.data.data));
          break;
        default:
          break;
      }
    })
    .catch((err) => {
      dispatch(slice.actions.hasError(err));
    });
};

export const getAllImages = (pageNumber) => (dispatch) => {
  axios
    .get(`/media/gallery?pageNumber=${pageNumber}`)
    .then((res) => {
      console.log(res.data.data);
      switch (res.data.code) {
        case SUCCESS:
          dispatch(slice.actions.getMediaGallerySuccess(res.data.data));
          break;
        default:
          break;
      }
    })
    .catch((err) => {
      dispatch(slice.actions.hasError(err));
    });
};

export const createImages = (images, Alert, reset) => (dispatch) => {
  axios
    .post('/media/gallery', images)
    .then((res) => {
      switch (res.data.code) {
        case SUCCESS:
          reset();
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

export const deleteImage = (id, SnackBar) => (dispatch) => {
  axios
    .put(`/media/gallery/${id}`)
    .then((res) => {
      switch (res.data.code) {
        case SUCCESS:
          dispatch(getAllImages());
          SnackBar('Succesfully deleted!', 'success');
          break;
        default:
          break;
      }
    })
    .catch((err) => {
      dispatch(slice.actions.hasError(err));
    });
};
