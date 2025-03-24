import sum from 'lodash/sum';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import { createSlice } from '@reduxjs/toolkit';
import setAuthToken from '../../utils/setAuthToken';
import { fileManagerNotification, getCompanyFileList, sendFenceNotification } from './user';
//
import { PATH_DASHBOARD } from '../../routes/paths';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  products: [],
  product: null,
  totalCount: null,
  category: [],
  requestCompany: null,
  assetRequests: [],
  assetRequest: {},
  assetRequestCount: {
    dataCount: 0,
    totalCount: 0,
    notStarted: 0,
    pending: 0,
    complete: 0,
  },
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
      state.isLoading = true;
    },

    finishLoading(state) {
      state.isLoading = false;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PRODUCTS
    getProductsSuccess(state, action) {
      state.isLoading = false;
      state.products = action.payload.product;
      state.totalCount = action.payload.totalcount;
    },
    // GET CATEGORY
    getCategorySuccess(state, action) {
      state.isLoading = false;
      state.category = action.payload;
    },
    // GET PRODUCT
    getProductSuccess(state, action) {
      state.isLoading = false;
      state.product = action.payload;
    },

    setAssetRequests(state, action) {
      state.isLoading = false;
      state.assetRequests = action.payload.fences;
      state.assetRequestCount = {
        dataCount: action.payload.dataCount,
        totalCount: action.payload.totalCount,
        notStarted: action.payload.notStarted,
        pending: action.payload.pending,
        complete: action.payload.complete,
      };
    },

    setAssetRequest(state, action) {
      state.isLoading = false;
      state.requestCompany = action.payload.company;
      state.assetRequest = action.payload.fences;
      state.assetRequestCount = {
        totalCount: action.payload.totalCount,
        notStarted: action.payload.notStarted,
        pending: action.payload.pending,
        complete: action.payload.complete,
      };
    },

    setAssetRequestSuccess(state, action) {
      state.isLoading = false;
      state.assetRequest = action.payload;
    },
    // CHECKOUT
    getCart(state, action) {
      const cart = action.payload;

      const totalItems = sum(cart.map((product) => product.quantity));
      const subtotal = sum(cart.map((product) => product.price * product.quantity));
      state.checkout.cart = cart;
      state.checkout.discount = state.checkout.discount || 0;
      state.checkout.shipping = state.checkout.shipping || 0;
      state.checkout.billing = state.checkout.billing || null;
      state.checkout.subtotal = subtotal;
      state.checkout.total = subtotal - state.checkout.discount;
      state.checkout.totalItems = totalItems;
    },

    addToCart(state, action) {
      const newProduct = action.payload;
      const isEmptyCart = !state.checkout.cart.length;

      if (isEmptyCart) {
        state.checkout.cart = [...state.checkout.cart, newProduct];
      } else {
        state.checkout.cart = state.checkout.cart.map((product) => {
          const isExisted = product.id === newProduct.id;

          if (isExisted) {
            return {
              ...product,
              colors: uniq([...product.colors, ...newProduct.colors]),
              quantity: product.quantity + 1,
            };
          }

          return product;
        });
      }
      state.checkout.cart = uniqBy([...state.checkout.cart, newProduct], 'id');
      state.checkout.totalItems = sum(state.checkout.cart.map((product) => product.quantity));
    },

    deleteCart(state, action) {
      const updateCart = state.checkout.cart.filter((product) => product.id !== action.payload);

      state.checkout.cart = updateCart;
    },

    resetCart(state) {
      state.checkout.cart = [];
      state.checkout.billing = null;
      state.checkout.activeStep = 0;
      state.checkout.total = 0;
      state.checkout.subtotal = 0;
      state.checkout.discount = 0;
      state.checkout.shipping = 0;
      state.checkout.totalItems = 0;
    },

    backStep(state) {
      state.checkout.activeStep -= 1;
    },

    nextStep(state) {
      state.checkout.activeStep += 1;
    },

    gotoStep(state, action) {
      const step = action.payload;
      state.checkout.activeStep = step;
    },

    increaseQuantity(state, action) {
      const productId = action.payload;

      const updateCart = state.checkout.cart.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            quantity: product.quantity + 1,
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    decreaseQuantity(state, action) {
      const productId = action.payload;
      const updateCart = state.checkout.cart.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            quantity: product.quantity - 1,
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    createBilling(state, action) {
      state.checkout.billing = action.payload;
    },

    applyDiscount(state, action) {
      const discount = action.payload;
      state.checkout.discount = discount;
      state.checkout.total = state.checkout.subtotal - discount;
    },

    applyShipping(state, action) {
      const shipping = action.payload;
      state.checkout.shipping = shipping;
      state.checkout.total = state.checkout.subtotal - state.checkout.discount + shipping;
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
  gotoStep,
  backStep,
  nextStep,
  deleteCart,
  createBilling,
  applyShipping,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity,
  setAssetRequests,
  setAssetRequest,
  setAssetRequestSuccess,
  finishLoading,
} = slice.actions;
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function getProducts(keyword) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      setAuthToken(localStorage.getItem('token'));
      const response = await axios.get(`/products${keyword ? `?keyword=${keyword}` : ''}`);
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
      const response = await axios.get(`/products/${id}`);

      const product = response.data.data;
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

export const addProduct = (productData, navigate, Snackbar, reset, showAlert) => (dispatch) => {
  axios
    .post('/products', productData)
    .then((res) => {
      showAlert();
      const response = res.data.data;
      dispatch(sendFenceNotification(response.name));
      // Snackbar('The product created succesfully!', 'success');
      // dispatch(getProducts());
      // navigate(PATH_DASHBOARD.eCommerce.list);
    })
    .catch((err) => {
      Snackbar('Server Error', 'error');
      reset();
    });
};

export const updateProduct = (id, product, Snackbar, navigate) => (dispatch) => {
  axios
    .put(`products/${id}`, product)
    .then((res) => {
      Snackbar('The user updated succesfully!', 'success');
      navigate(PATH_DASHBOARD.general.fences);
    })
    .catch((err) => {
      Snackbar('Server Error', {
        variant: 'error',
      });
    });
};

export const updateProductsVisible = (updateData, Snackbar) => (dispatch) => {
  axios
    .post(`products/update/visible`, updateData)
    .then((res) => {
      Snackbar('Succesfully Updated!', 'success');
    })
    .catch((err) => {
      Snackbar('Server Error', 'error');
    });
};
export const updateProductsStatus = (updateData, Snackbar) => (dispatch) => {
  axios
    .post(`products/update/status`, updateData)
    .then((res) => {
      Snackbar('Succesfully Updated!', 'success');
    })
    .catch((err) => {
      Snackbar('Server Error', 'error');
    });
};

export function updateSelectedFences(id, userData, companySearchParams, Snackbar) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      setAuthToken(localStorage.getItem('token'));
      await axios.put(`/user/${id}`, userData);
      Snackbar('Succesfully saved!', 'success');
      dispatch(fileManagerNotification(id));
      dispatch(slice.actions.finishLoading());
      dispatch(getCompanyFileList(companySearchParams));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
// ---------------------------------------------------------------------
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

export function getCategory(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/category/${id}`);

      const category = response.data.data;
      const count = category.Presigned_url;
      const images = [];
      count.forEach((item) => {
        images.push('https://rf-test-test.s3.amazonaws.com/'.concat(item));
      });
      category.images = images;
      dispatch(slice.actions.getCategorySuccess(category));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export const deleteCategory = (id, Snackbar) => (dispatch) => {
  axios
    .put(`category/delete/${id}`)
    .then((res) => {
      dispatch(getCategories());
      Snackbar('The selected product was deleted succesfully!', 'success');
    })
    .catch((err) => {
      Snackbar('Server Error', {
        variant: 'error',
      });
    });
};

export const deleteCategorys = (ids, Snackbar) => (dispatch) => {
  axios
    .post(`category/deletes`, { ids })
    .then((res) => {
      dispatch(getCategories());
      Snackbar('The selected product was deleted succesfully!', 'success');
    })
    .catch((err) => {
      Snackbar('Server Error', {
        variant: 'error',
      });
    });
};

export const updateCategory = (id, category, imageUrlList, Snackbar, navigate) => (dispatch) => {
  axios
    .put(`category/${id}`, {
      category,
      imageUrlList,
    })
    .then((res) => {
      Snackbar('The user updated succesfully!', 'success');
      navigate(PATH_DASHBOARD.eCommerce.category);
    })
    .catch((err) => {
      console.log(err);
      Snackbar('Server Error', {
        variant: 'error',
      });
    });
};

export const getAssetRequests = (searchParams) => (dispatch) => {
  dispatch(slice.actions.startLoading());
  axios
    .get(`products/assetRequests/getAll${searchParams ? `?${searchParams}` : ''}`)
    .then((res) => {
      dispatch(slice.actions.setAssetRequests(res.data.data));
    })
    .catch((err) => {
      dispatch(slice.actions.hasError(err));
    });
};

export const deleteAssetRequests = (condition, Snackbar) => (dispatch) => {
  axios
    .post(`products/assetRequests/delete`, condition)
    .then((res) => {
      dispatch(getAssetRequests());
      Snackbar('The Selected Requests are Deleted Succesfully!', 'success');
    })
    .catch((err) => {
      Snackbar('Server Error', 'error');
    });
};

export const deleteAssetRequest = (deleteId, requestId, Snackbar) => (dispatch) => {
  dispatch(slice.actions.startLoading());
  axios
    .put(`products/assetRequest/delete/${deleteId}`)
    .then((res) => {
      dispatch(getAssetRequest(requestId));
      Snackbar('The selected request is deleted succesfully!', 'success');
    })
    .catch((err) => {
      Snackbar('Server Error', 'error');
    });
};

export const getAssetRequest = (id) => (dispatch) => {
  dispatch(slice.actions.startLoading());
  axios
    .get(`products/assetRequests/get/${id}`)
    .then((res) => {
      dispatch(slice.actions.setAssetRequest(res.data.data));
    })
    .catch((err) => {
      dispatch(slice.actions.hasError(err));
    });
};

export const getAssetRequestById = (id) => (dispatch) => {
  dispatch(slice.actions.startLoading());
  axios
    .get(`products/assetRequest/get/${id}`)
    .then((res) => {
      dispatch(slice.actions.setAssetRequestSuccess(res.data.data));
    })
    .catch((err) => {
      dispatch(slice.actions.hasError(err));
    });
};
