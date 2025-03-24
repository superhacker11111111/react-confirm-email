import { createSlice } from '@reduxjs/toolkit';
// utils
import {  CREATED } from '../../assets/data/resCode';
import axios from '../../utils/axios';
import setAuthToken from '../../utils/setAuthToken';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';

const initialState = {
  isloading: false,
  error: null,
  price: null,
  prices: [],
};

const slice = createSlice({
  name: 'price',
  initialState,
  reducers: {
    startLoading(state) {
      state.isloading = true;
    },

    hasError(state, action) {
      state.isloading = false;
      state.error = action.payload;
    },

    getPricesSuccess(state, action) {
      state.isloading = false;
      state.prices = action.payload;
    },

    getPriceSuccess(state, action) {
      state.isloading = false;
      state.price = action.payload;
    },
  },
});

export default slice.reducer;

export const { getPricesSuccess, getPriceSuccess } = slice.actions;

export const getPrices = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.get('/pricing/pricingItem');
    dispatch(slice.actions.getPricesSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getPrice = (id) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`/pricing/pricingItem/${id}`);
    const reData = {
      commons: response.data.data.commons,
      popular: response.data.data.popular,
      discount: response.data.data.discount,
      id: response.data.data.id,
      createdAt: response.data.data.createdAt,
      license: response.data.data.license,
      order: response.data.data.order,
      price: response.data.data.price,
      options: response.data.data.options,
    };
    dispatch(slice.actions.getPriceSuccess(reData));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const addPrice = (priceData, Snackbar, navigate, reset) => (dispatch) => {
  axios
    .post('/pricing/pricingItem', {
      priceData,
    })
    .then((res) => {
      switch (res.data.code) {
        case CREATED:
          Snackbar('The new price created succesfully!', 'success');
          navigate(PATH_DASHBOARD.pricing.list);
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

export const updatePrice = (id, priceData, Snackbar, navigate, reset) => (dispatch) => {
  axios
    .put(`/pricing/pricingItem/${id}`, {
      priceData,
    })
    .then((res) => {
      Snackbar('The price updated succesfully!', 'success');
      navigate(PATH_DASHBOARD.pricing.list);
    })
    .catch((err) => {
      Snackbar('Server Error', 'error');
      reset();
    });
};

export const deletePrice = (id, Snackbar) => (dispatch) => {
  axios
    .put(`pricing/pricingItem/delete/${id}`)
    .then((res) => {
      dispatch(getPrices());
      Snackbar('The selected price was deleted succesfully!', 'success');
    })
    .catch((err) => {
      Snackbar('Server Error', {
        variant: 'error',
      });
    });
};
