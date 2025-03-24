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
  price: null,
  origin: null,
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
    getOriginSuccess(state, action) {
      state.origin = action.payload;
    },
    getPriceSuccess(state, action) {
      state.isloading = false;
      state.price = action.payload;
    },
  },
});

export default slice.reducer;

export const { getPricesSuccess, getPriceSuccess, getOriginSuccess } = slice.actions;

export const getPrices = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get('/pricing/pricingCard');
    const data_list_temp = [];
    let array = response.data.data;
    while (array.length > 0) {
      // eslint-disable-next-line
      const temp_array = array.filter((element) => element.id === array[0].id);
      temp_array.sort((a, b) => a.optionorder - b.optionorder);

      const item = {
        itemId: array[0].id,
        commons: array[0].commons,
        price: array[0].price,
        id: array[0].order,
        discount: array[0].discount,
        stripe_price_year_id: array[0].stripe_price_year_id,
        stripe_price_month_id: array[0].stripe_price_month_id,
        popular: array[0].popular,
        license: array[0].license,
        options: [],
      };
      temp_array.forEach((element) => {
        item.options.push({
          title: element.title,
          disabled: element.disabled,
        });
      });
      data_list_temp.push(item);
      // eslint-disable-next-line
      array = array.filter((element) => element.id !== array[0].id);
    }
    dispatch(slice.actions.getPricesSuccess(data_list_temp));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getPrice = (id) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`/pricing/pricingCard/${id}`);
    const data_list_temp = [];
    let array = response.data.data;
    while (array.length > 0) {
      // eslint-disable-next-line
      const temp_array = array.filter((element) => element.id === array[0].id);
      temp_array.sort((a, b) => a.optionorder - b.optionorder);

      const item = {
        itemId: array[0].id,
        commons: array[0].commons,
        price: array[0].price,
        id: array[0].order,
        discount: array[0].discount,
        stripe_price_year_id: array[0].stripe_price_year_id,
        stripe_price_month_id: array[0].stripe_price_month_id,
        popular: array[0].popular,
        license: array[0].license,
        options: [],
      };
      temp_array.forEach((element) => {
        item.options.push({
          title: element.title,
          disabled: element.disabled,
        });
      });
      data_list_temp.push(item);
      // eslint-disable-next-line
      array = array.filter((element) => element.id !== array[0].id);
    }
    dispatch(slice.actions.getPriceSuccess(data_list_temp));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getCurrentPrice = (id) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`/subscription/${id}`);
    dispatch(slice.actions.getOriginSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};
