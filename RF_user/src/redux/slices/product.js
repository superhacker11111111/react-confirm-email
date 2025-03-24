import { createSlice } from '@reduxjs/toolkit';
import setAuthToken from '../../utils/setAuthToken';
//
import { PATH_DASHBOARD } from '../../routes/paths';
// utils
import axios from '../../utils/axios';
import { Selectable } from '../../assets/data/roles';

// ----------------------------------------------------------------------

const initialState = {
  loading: false,
  error: null,
  products: [],
  category: [],
  product: null,
  product_count: 0,
  selected_count: 0,
  selected_Fences: [],
  favorite_list: [],
  new_request_list: [],
  request_list: [],
  selected_list: [],
  new_favorite_list: [],
  new_selected_list: [],
  removed_list: [],
  categoryTitle: '',
  selectFences: [],
  selectedFences: [],
  requestedFences: [],
  selectableElements: [],
  selectable: 1,
  selectedAvailable: 30,
  onboardingAvailable: 0,
  checkout: {
    activeStep: 0,
    cart: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    shipping: 0,
    billing: null,
    totalItems: 0,
  },
};

const slice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.loading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // GET PRODUCTS
    getProductsSuccess(state, action) {
      state.loading = false;
      state.products = action.payload.product;
      state.selectFences = action.payload.list;
      state.product_count = action.payload.totalCount;
      state.selected_count = action.payload.selectedCount;
    },
    getSelectableElements(state, action) {
      state.loading = false;
      state.selectableElements = action.payload;
    },
    getCategoryTitle(state, action) {
      state.categoryTitle = action.payload;
    },
    // GET CATEGORY
    getCategorySuccess(state, action) {
      state.loading = false;
      state.category = action.payload.category;
      state.product_count = action.payload.productCount;
      state.selected_count = action.payload.selectedCount;
    },

    // GET PRODUCT
    getProductSuccess(state, action) {
      state.loading = false;
      state.product = action.payload;
    },
    setSelectedList(state, action) {
      state.selected_list = action.payload;
    },
    setFavourList(state, action) {
      state.favorite_list = action.payload;
    },
    setRequestList(state, action) {
      state.request_list = action.payload;
    },
    setRequestSwapperList(state, action) {
      state.new_request_list = action.payload;
    },
    setRemovedList(state, action) {
      state.removed_list = action.payload;
    },
    setNewSelectedList(state, action) {
      state.new_selected_list = action.payload;
    },
    setNewFavourList(state, action) {
      state.new_favorite_list = action.payload;
    },
    setNewRequestList(state, action) {
      state.new_request_list = action.payload;
    },
    setSelectedAvailable(state, action) {
      state.selectedAvailable = action.payload;
    },
    setOnboardingAvailable(state, action) {
      state.onboardingAvailable = action.payload;
    },
    setSelectedFences(state, action) {
      state.selectedFences = action.payload;
    },
    setRequestedFences(state, action) {
      state.requestedFences = action.payload;
    },

    selecteFencesAddSelect(state, action) {
      state.selected_Fences.push(action.payload);
    },
    selecteFencesAddRequest(state, action) {
      state.request_list.push(state, action.payload);
    },
    setSelectable(state, action) {
      state.selectable = action.payload;
    },
    formatOnboardingData(state, action) {
      state.selected_list = [];
      state.request_list = [];
      state.favorite_list = [];
      state.new_selected_list = [];
      state.new_request_list = [];
      state.new_favorite_list = [];
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  getCart,
  addToCart,
  resetCart,
  setFavourList,
  setRequestList,
  setSelectedList,
  setNewFavourList,
  setNewRequestList,
  setNewSelectedList,
  getCategoryTitle,
  gotoStep,
  backStep,
  nextStep,
  deleteCart,
  createBilling,
  applyShipping,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity,
  selecteFencesAddSelect,
  getSelectableElements,
  setSelectable,
  setSelectedFences,
  setSelectedAvailable,
  setOnboardingAvailable,
  setRequestedFences,
  formatOnboardingData,
} = slice.actions;

// ----------------------------------------------------------------------

export function getProducts() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      setAuthToken(localStorage.getItem('token'));
      const response = await axios.get(`/products/list/`);
      dispatch(slice.actions.getProductsSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getSelectedProducts() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      setAuthToken(localStorage.getItem('token'));
      const response = await axios.get(`/products/selected/list`);
      dispatch(slice.actions.getProductsSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getCategories() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      setAuthToken(localStorage.getItem('token'));
      const response = await axios.get(`/category`);
      dispatch(slice.actions.getCategorySuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getProductsCategory(categoryId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      setAuthToken(localStorage.getItem('accessToken'));
      const response = await axios.get(`/products/category/${categoryId}`);

      dispatch(slice.actions.getProductsSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
// ----------------------------------------------------------------------
export function getProduct(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/products/category/${id}`, {
        params: { id },
      });
      const product = response.data.data;
      const images = [];
      // count.forEach((item) => {
      //   images.push('https://rf-test-test.s3.amazonaws.com/'.concat(item));
      // });
      product.images = images;
      dispatch(slice.actions.getProductSuccess(product));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
//---------------
export const deleteProduct = (id, Snackbar) => (dispatch) => {
  axios
    .put(`products/delete/${id}`)
    .then((res) => {
      dispatch(getProducts());
      Snackbar('The selected product was deleted succesfully!', 'success');
    })
    .catch((err) => {
      Snackbar('Server Error', {
        variant: 'error',
      });
    });
};
export const deleteProducts = (ids, Snackbar) => (dispatch) => {
  axios
    .post(`products/deletes`, { ids })
    .then((res) => {
      dispatch(getProducts());
      Snackbar('The selected product was deleted succesfully!', 'success');
    })
    .catch((err) => {
      Snackbar('Server Error', {
        variant: 'error',
      });
    });
};
export const updateProduct = (id, product, Snackbar, navigate) => (dispatch) => {
  axios
    .put(`products/${id}`, {
      product,
    })
    .then((res) => {
      Snackbar('The user updated succesfully!', 'success');
      navigate(PATH_DASHBOARD.eCommerce.list);
    })
    .catch((err) => {
      Snackbar('Server Error', {
        variant: 'error',
      });
    });
};
//----------------------
export const addStatus = (selectData, Snackbar, navigate, reset) => (dispatch) => {
  dispatch(slice.actions.selecteFencesAddSelect(selectData));
  // axios
  //   .post('/products/productselection', {
  //     selectData,
  //   })
  //   .then((res) => {
  //     switch (res.data.code) {
  //       case 200:
  //         Snackbar('You selected fences succesfully!', 'success');
  //         dispatch(slice.actions.selecteFencesAddSelect(res.data.data.count));
  //         navigate(PATH_ONBOARDING.onboarding.categoryfences);
  //         break;
  //       default:
  //         break;
  //     }
  //   })
  //   .catch((err) => {
  //     Snackbar('Server Error', 'error');
  //     reset();
  //   });
};
export const setFavour = (fenceData) => (dispatch) => {
  dispatch(slice.actions.setFavourList(fenceData));
};

export const setRequest = (fenceData) => (dispatch) => {
  dispatch(slice.actions.setRequestList(fenceData));
};

export const setSelected = (fenceData) => (dispatch) => {
  dispatch(slice.actions.setSelectedList(fenceData));
};
// set new added favor list onboarding
export const setNewFavour = (fenceData) => (dispatch) => {
  dispatch(slice.actions.setNewFavourList(fenceData));
};
// set new added request list onboarding
export const setNewRequest = (fenceData) => (dispatch) => {
  dispatch(slice.actions.setNewRequestList(fenceData));
};
// set new added select list onboarding
export const setNewSelected = (fenceData) => (dispatch) => {
  dispatch(slice.actions.setNewSelectedList(fenceData));
};

export const setRequestSwapper = (fenceData) => (dispatch) => {
  dispatch(slice.actions.setRequestSwapperList(fenceData));
};

export const setRemoved = (fenceData) => (dispatch) => {
  dispatch(slice.actions.setRemovedList(fenceData));
};

export const setSelAvailable = (count) => (dispatch) => {
  dispatch(slice.actions.setSelectedAvailable(count));
};

export const setOnboardingAvailableCount = (count) => (dispatch) => {
  dispatch(slice.actions.setOnboardingAvailable(count));
};

export const requestProduct = (productData, Snackbar, reset) => (dispatch) => {
  axios
    .post('/products/add', { data: productData })
    .then((res) => {
      Snackbar('The product created succesfully!', 'success');
      reset();
    })
    .catch((err) => {
      Snackbar('Server Error', 'error');
      reset();
    });
};

export const setCurrentSelectedFences = (fences) => (dispatch) => {
  dispatch(slice.actions.setSelectedFences(fences));
};

export const requestProductList = (userId, userType) => (dispatch) => {
  axios
    .get(`/products/getRequest/${userId}`)
    .then((res) => {
      dispatch(
        slice.actions.setFavourList(
          res.data.data.favoritelist.filter(
            (item) => item !== null && item !== '' && item !== undefined
          )
        )
      );
      dispatch(
        slice.actions.setSelectedList(
          res.data.data.selectedlist.filter(
            (item) => item !== null && item !== '' && item !== undefined
          )
        )
      );
      dispatch(
        slice.actions.setRequestList(
          res.data.data.requestlist.filter(
            (item) => item !== null && item !== '' && item !== undefined
          )
        )
      );
    })
    .catch((err) => {
      dispatch(slice.actions.hasError(err));
    });
};
// Onboarding onclick category
export const getSelectableProducts = (selectable, params, category) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    setAuthToken(localStorage.getItem('accessToken'));

    const response =
      selectable === Selectable.Fence
        ? await axios.post('/products/getCategories', { data: params })
        : await axios.get('/category');
    dispatch(
      slice.actions.getCategoryTitle(selectable === Selectable.Fence ? category : 'Categories')
    );
    dispatch(setSelectable(selectable));
    dispatch(
      slice.actions.getSelectableElements(
        selectable === Selectable.Fence ? response.data.data.elements : response.data.data.category
      )
    );
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

// format onboarding data if the user register twice with the same browser
export const onboardingFormat = () => async (dispatch) => {
  dispatch(slice.actions.formatOnboardingData());
};
