import { createSlice } from '@reduxjs/toolkit';
// utils
import { ALREADY_EXIST, CREATED } from '../../assets/data/resCode';
import axios from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';

const initialState = {
  isloading: false,
  error: null,
  blog: null,
  blogs: [],
  drafts: [],
};

const slice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    startLoading(state) {
      state.isloading = true;
    },

    hasError(state, action) {
      state.isloading = false;
      state.error = action.payload;
    },

    getBlogsSuccess(state, action) {
      state.isloading = false;
      state.blogs = action.payload;
    },

    getDraftsSuccess(state, action) {
      state.isloading = false;
      state.drafts = action.payload;
    },

    getBlogSuccess(state, action) {
      state.isloading = false;
      state.blog = action.payload;
    },
  },
});

export default slice.reducer;

export const { getBlogsSuccess, getBlogSuccess } = slice.actions;

export const getBlogs = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get('/blog');
    dispatch(slice.actions.getBlogsSuccess(response.data.data.blogs));
    dispatch(slice.actions.getDraftsSuccess(response.data.data.drafts));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getBlog = (id) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`/blog/${id}`);
    dispatch(slice.actions.getBlogSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const addBlog = (blogData, Alert, SnackBar) => (dispatch) => {
  axios
    .post('/blog', blogData)
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

export const updateBlog = (id, blogData, SnackBar, navigate) => (dispatch) => {
  axios
    .put(`blog/${id}`, blogData)
    .then((res) => {
      navigate(PATH_DASHBOARD.general.blog.list);
      SnackBar('Successfully updated!', 'success');
    })
    .catch((err) => {
      dispatch(slice.actions.hasError(err));
    });
};

export const deleteBlog = (id, Snackbar) => (dispatch) => {
  axios
    .put(`blog/delete/${id}`)
    .then((res) => {
      dispatch(getBlogs());
      Snackbar('Succesfully deleted!', 'success');
    })
    .catch((err) => {
      Snackbar('Server Error', {
        variant: 'error',
      });
    });
};
