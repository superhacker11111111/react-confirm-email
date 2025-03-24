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
  service: null,
  services: [],
};

const slice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    startLoading(state) {
      state.isloading = true;
    },

    hasError(state, action) {
      state.isloading = false;
      state.error = action.payload;
    },

    getServicesSuccess(state, action) {
      state.isloading = false;
      state.services = action.payload;
    },

    getServiceSuccess(state, action) {
      state.isloading = false;
      state.service = action.payload;
    },
  },
});

export default slice.reducer;

export const { getServicesSuccess, getServiceSuccess } = slice.actions;

export const getServices = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.get('/pricing/pricingOption/');
    dispatch(slice.actions.getServicesSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getService = (id) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`/pricing/pricingOption/${id}`);
    dispatch(slice.actions.getServiceSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const addService = (serviceData, Snackbar, navigate) => (dispatch) => {
  axios
    .post('/pricing/pricingOption', {
      serviceData,
    })
    .then((res) => {
      switch (res.data.code) {
        case CREATED:
          Snackbar('The new service created succesfully!', 'success');
          navigate(PATH_DASHBOARD.service.list);
          break;
        case ALREADY_EXIST:
          Snackbar('Email already exists', 'error');
          break;
        default:
          break;
      }
    })
    .catch((err) => {
      Snackbar('Server Error', 'error');
    });
};

export const updateService = (id, serviceData, Snackbar, navigate) => (dispatch) => {
  axios
    .put(`/pricing/pricingOption/${id}`, {
      serviceData,
    })
    .then((res) => {
      Snackbar('The service updated succesfully!', 'success');
      navigate(PATH_DASHBOARD.service.list);
    })
    .catch((err) => {
      switch (err.data.message) {
        case 'Email already exists':
          Snackbar('Email already exists', 'error');
          break;
        default:
          Snackbar('Server Error', 'error');
          break;
      }
    });
};

export const deleteService = (id, Snackbar) => (dispatch) => {
  axios
    .put(`pricing/pricingOption/delete/${id}`)
    .then((res) => {
      dispatch(getServices());
      Snackbar('The selected service was deleted succesfully!', 'success');
    })
    .catch((err) => {
      Snackbar('Server Error', {
        variant: 'error',
      });
    });
};

// export const deleteServices = (ids, Snackbar) => (dispatch) => {
//   axios
//     .put(`pricing/services/delete`, { ids })
//     .then((res) => {
//       dispatch(getServices());
//       Snackbar('The selected services was deleted succesfully!', 'success');
//     })
//     .catch((err) => {
//       Snackbar('Server Error', {
//         variant: 'error',
//       });
//     });
// };
