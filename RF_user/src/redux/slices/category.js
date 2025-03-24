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
  category: null,
  categories: [],
  styles: [],
  totalCount: 0,
};

const slice = createSlice({
  name: 'category',
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
      state.categories = action.payload.category;
      state.totalCount = action.payload.totalCount;
    },

    getStylesSuccess(state, action) {
      state.isloading = false;
      state.styles = action.payload;
    },

    getCategorySuccess(state, action) {
      state.isloading = false;
      state.category = action.payload;
    },
  },
});

export default slice.reducer;

export const { getCategoriesSuccess, getCategorySuccess, getStylesSuccess } = slice.actions;

export const getCategories = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.get('/category');
    dispatch(slice.actions.getCategoriesSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getCategory = (id) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`/category/${id}`);
    dispatch(slice.actions.getCategorySuccess(response.data.data));
    dispatch(slice.actions.setSubCategoryList(response.data.data.sub_categories));
    dispatch(slice.actions.setStyleList(response.data.data.styles));
    dispatch(slice.actions.setColorList(response.data.data.colors));
    dispatch(slice.actions.setCategoryTitle(response.data.data.name));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const addCategory = (categoryData, Snackbar, navigate, reset) => (dispatch) => {
  axios
    .post('/category', categoryData)
    .then((res) => {
      switch (res.data.code) {
        case CREATED:
          getCategories();
          Snackbar('The new category created succesfully!', 'success');
          break;
        case ALREADY_EXIST:
          Snackbar('The category already exist', 'error');
          break;
        default:
          break;
      }
    })
    .catch((err) => {
      Snackbar('Server Error', 'error');
      reset();
    });
};

export const updateCategory = (id, data, Snackbar, navigate, reset) => (dispatch) => {
  axios
    .put(`/category/${id}`, data)
    .then((res) => {
      getCategories();
      Snackbar('The category updated succesfully!', 'success');
      navigate(PATH_DASHBOARD.eCommerce.category);
    })
    .catch((err) => {
      Snackbar('Server Error', 'error');
      reset();
    });
};

export const deleteCategory = (id, Snackbar) => (dispatch) => {
  axios
    .put(`category/delete/${id}`)
    .then((res) => {
      dispatch(getCategories());
      Snackbar('The category was deleted succesfully!', 'success');
    })
    .catch((err) => {
      Snackbar('Server Error', {
        variant: 'error',
      });
    });
};

export const getStyles = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.get('/category/styles/all');
    const designs = response.data.data;
    let styles = [];
    if (designs && designs.length > 0) {
      designs.forEach((element) => {
        // eslint-disable-next-line no-unused-expressions
        element.styles &&
          element.styles &&
          element.styles.forEach((ele) => {
            styles = [...new Set([...styles, ele.title])];
          });
      });
    }
    dispatch(slice.actions.getStylesSuccess(styles));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

// export const deleteUsers = (ids, Snackbar) => (dispatch) => {
//   axios
//     .put(`user/users/delete`, { ids })
//     .then((res) => {
//       dispatch(getUsers());
//       Snackbar('The selected users was deleted succesfully!', 'success');
//     })
//     .catch((err) => {
//       Snackbar('Server Error', {
//         variant: 'error',
//       });
//     });
// };
