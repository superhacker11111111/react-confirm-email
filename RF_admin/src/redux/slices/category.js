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
  categoryTitle: '',
  categoryImage: {
    key: '',
    preview: '',
  },
  categories: [],
  subCategoryList: [],
  styleList: [],
  colorList: [],
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

    getCategorySuccess(state, action) {
      state.isloading = false;
      state.category = action.payload;
    },

    setSubCategoryList(state, action) {
      state.isloading = false;
      state.subCategoryList = action.payload;
    },

    setStyleList(state, action) {
      state.isloading = false;
      state.styleList = action.payload;
    },

    setColorList(state, action) {
      state.isloading = false;
      state.colorList = action.payload;
    },

    setCategoryTitle(state, action) {
      state.isloading = false;
      state.categoryTitle = action.payload;
    },

    setCategoryImage(state, action) {
      state.isloading = false;
      state.categoryImage = action.payload;
    },
  },
});

export default slice.reducer;

export const {
  getCategoriesSuccess,
  getCategorySuccess,
  setSubCategoryList,
  setStyleList,
  setColorList,
  setCategoryTitle,
  setCategoryImage,
} = slice.actions;

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
    dispatch(slice.actions.setCategoryImage(response.data.data.images));
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
    });
};

export const updateCategory =
  (id, data, Snackbar, navigate, type = false) =>
  (dispatch) => {
    axios
      .put(`/category/${id}`, data)
      .then((res) => {
        if (type) {
          Snackbar('The category updated succesfully!', 'success');
        } else {
          getCategories();
          Snackbar('The category updated succesfully!', 'success');
          navigate(PATH_DASHBOARD.eCommerce.category);
        }
      })
      .catch((err) => {
        Snackbar('Server Error', 'error');
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

export const setSubCategories = (sub_categories) => (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    dispatch(slice.actions.setSubCategoryList(sub_categories));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const setStyles = (styles) => (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    dispatch(slice.actions.setStyleList(styles));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const setColors = (colors) => (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    dispatch(slice.actions.setColorList(colors));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const setCategory = (title) => (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    dispatch(slice.actions.setCategoryTitle(title));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const setCategoryImages = (image) => (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    dispatch(slice.actions.setCategoryImage(image));
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
