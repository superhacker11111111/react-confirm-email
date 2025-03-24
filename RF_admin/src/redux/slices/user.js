import { createSlice } from '@reduxjs/toolkit';
// utils
import { ALREADY_EXIST, CREATED, NO_EXIST, SUCCESS } from '../../assets/data/resCode';
import axios from '../../utils/axios';
import setAuthToken from '../../utils/setAuthToken';
import { EMAIL_ALREADY_EXIST } from '../../assets/data/message';
// routes
import { PATH_DASHBOARD, PATH_PAGE } from '../../routes/paths';

const initialState = {
  isloading: false,
  error: null,
  user: null,
  company: null,
  users: [],
  companies: [],
  countries: [],
  states: [],
  admins: [],
  shoppers: [],
  manageUsers: [],
  shopperCount: 0,
  companyCount: {
    dataCount: 0,
    totalCount: 0,
    active: 0,
    pause: 0,
    cancelled: 0,
    allActive: 0,
    allPause: 0,
    allCancelled: 0,
  },
  fences: [],
  selectedFences: [],
  requestFences: [],
  planCount: 0,
  totalCount: {
    totalCount: 0,
    notStarted: 0,
    pending: 0,
    completed: 0,
    modeling: 0,
  },
  updatePaymentInfo: {
    priceId: '',
    billing_company: '',
    billing_addressline1: '',
    billing_addressline2: '',
    billing_city: '',
    billing_zipCode: '',
    billing_country: '',
    billing_state: '',
    cardholderName: '',
    paymentMethod: '',
    paymentType: false,
    customPrice: '',
  },
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    startLoading(state) {
      state.isloading = true;
    },

    hasError(state, action) {
      state.isloading = false;
      state.error = action.payload;
    },

    getUsersSuccess(state, action) {
      state.isloading = false;
      state.users = action.payload;
    },

    getManageUsersSuccess(state, action) {
      state.isloading = false;
      state.manageUsers = action.payload;
    },

    getCompaniesSuccess(state, action) {
      state.isloading = false;
      state.companies = action.payload.companies;
      state.companyCount = {
        dataCount: action.payload.dataCount,
        totalCount: action.payload.totalCount,
        active: action.payload.active,
        pause: action.payload.pause,
        cancelled: action.payload.cancelled,
        allActive: action.payload.allActive,
        allPause: action.payload.allPause,
        allCancelled: action.payload.allCancelled,
      };
    },

    getCompanyFileListSuccess(state, action) {
      state.isloading = false;
      state.company = action.payload.company;
      state.planCount = action.payload.planCount;
      state.fences = action.payload.filteredFences;
      state.totalCount = {
        notStarted: action.payload.notStarted,
        pending: action.payload.pending,
        completed: action.payload.completed,
        modeling: action.payload.modeling,
      };
    },

    getAllCompaniesSuccess(state, action) {
      state.isloading = false;
      state.companies = action.payload;
    },

    getShoppersSuccess(state, action) {
      state.isloading = false;
      state.shoppers = action.payload.shoppers;
      state.shopperCount = action.payload.totalCount;
    },

    getUserSuccess(state, action) {
      state.isloading = false;
      state.user = action.payload;
    },

    getAdminsSuccess(state, action) {
      state.isloading = false;
      state.admins = action.payload;
    },

    getCountryAndStatesSuccess(state, action) {
      state.isloading = false;
      state.countries = action.payload.countries;
      state.states = action.payload.states;
    },

    setUpdatePaymentInfo(state, action) {
      state.updatePaymentInfo = action.payload;
    },
  },
});

export default slice.reducer;

export const {
  getUsersSuccess,
  getUserSuccess,
  getCompaniesSuccess,
  getCompanyFileInfoSuccess,
  getCompanyFileListSuccess,
  getAdminsSuccess,
  getShoppersSuccess,
  getAllCompaniesSuccess,
  getManageUsersSuccess,
  getCountryAndStatesSuccess,
  setUpdatePaymentInfo,
} = slice.actions;

export const getUsers = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.get('/user');
    dispatch(slice.actions.getUsersSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getUser = (id) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`/auth/initialize/${id}`);
    dispatch(slice.actions.getUserSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const addUser = (userData, Snackbar, navigate) => (dispatch) => {
  axios
    .post('/user', {
      userData,
    })
    .then((res) => {
      switch (res.data.code) {
        case CREATED:
          Snackbar('The new user created succesfully!', 'success');
          navigate(PATH_DASHBOARD.user.list);
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

export const addUsers = (id, emails, Snackbar, callback) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.post(`/user/addUsers/${id}`, { emailList: emails });
    callback(response.data);
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const updateUser = (id, userData, Snackbar, navigate) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const res = await axios.put(`/user/${id}`, userData);
    switch (res.data.code) {
      case SUCCESS:
        Snackbar('Succesfully updated!', 'success');
        dispatch(slice.actions.getUserSuccess(res.data.data));
        break;
      case ALREADY_EXIST:
        Snackbar('Email already exists', 'error');
        break;
      default:
        break;
    }
  } catch (err) {
    dispatch(slice.actions.hasError(err));
  }
};

export const deleteUser = (id, Snackbar) => (dispatch) => {
  axios
    .put(`user/delete/${id}`)
    .then((res) => {
      dispatch(getUsers());
      Snackbar('The selected user was deleted succesfully!', 'success');
    })
    .catch((err) => {
      Snackbar('Server Error', {
        variant: 'error',
      });
    });
};

export const deleteUsers = (ids) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    await axios.put(`user/users/delete`, ids);
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const deleteUserByEmail = (email, snackbar) => async (dispatch) => {
  axios
    .put(`user/deleteByEmail/${email}`)
    .then((res) => {
      snackbar('Succesfully deleted!', 'success');
    })
    .catch((err) => {
      snackbar('Server Error', {
        variant: 'error',
      });
    });
};

export const deleteUsersByEmail = (removeCompany) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  axios
    .put('/user/users/deleteByEmail', removeCompany)
    .then((response) => {
      dispatch(slice.actions.getdeleteUsersSuccess(response.data.data));
      dispatch(getManageUsers(localStorage.getItem('companyId')));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getCompanies = (searchParams) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`/user/companies/all?${searchParams}`);
    dispatch(slice.actions.getCompaniesSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getCompanyFileList = (searchParams) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`/user/company/fileList?${searchParams}`);
    dispatch(slice.actions.getCompanyFileListSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getAllCompanies = (searchParams) => async (dispatch) => {
  dispatch(slice.actions.startLoading());

  try {
    const response = await axios.get(`/user?${searchParams}`);
    dispatch(slice.actions.getAllCompaniesSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getShoppers = (searchParams) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`/user/shopper/all?${searchParams}`);
    dispatch(slice.actions.getShoppersSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getAdmins = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`/user/admins/all`);
    dispatch(slice.actions.getAdminsSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const addAdmins = (id, adminData, SnackBar, reset) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    await axios.put(`/user/admin/${id}`, adminData);
    SnackBar('Successfully added', 'success');
    // dispatch(getAdmins());
    reset();
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const addCompany = (companyData, navigate, SnackBar, reset) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    await axios.post(`/user/company`, companyData);
    navigate(PATH_DASHBOARD.general.user.list);
    SnackBar('Successfully added', 'success');
    reset();
  } catch (error) {
    reset();
    dispatch(slice.actions.hasError(error));
  }
};

export const deleteAdmin = (id, Snackbar) => (dispatch) => {
  axios
    .put(`user/delete/${id}`)
    .then((res) => {
      dispatch(getAdmins());
      Snackbar('Succesfully deleted!', 'success');
    })
    .catch((err) => {
      Snackbar('Server Error', {
        variant: 'error',
      });
    });
};

export const getManageUsers = (parentId) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.post('/user/get/parentId', { parentId });
    dispatch(slice.actions.getManageUsersSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getCountryList = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get('/user/getAll/country/state');
    dispatch(slice.actions.getCountryAndStatesSuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const updateAccountInfo = (id, updateData, SnackBar, navigate) => async (dispatch) => {
  try {
    setAuthToken(localStorage.getItem('accessToken'));
    const response = await axios.put(`/user/update/account/${id}`, updateData);
    switch (response.data.code) {
      case ALREADY_EXIST:
        SnackBar('The Email is already exist!', 'error');
        break;
      case NO_EXIST:
        SnackBar('The User is Not Exist', 'error');
        break;
      case SUCCESS:
        SnackBar('Succesfully Updated', 'success');
        navigate(PATH_PAGE.upgradeAccountSuccess);
        break;
      default:
        break;
    }
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const deleteCompany = (userId, deleteId, Snackbar) => async (dispatch) => {
  axios
    .put(`user/delete/${deleteId}`)
    .then((res) => {
      dispatch(getManageUsers(userId));
      Snackbar('Succesfully deleted!', 'success');
    })
    .catch((err) => {
      Snackbar('Server Error', {
        variant: 'error',
      });
    });
};

export const addCompanies = (userId, companyData, SnackBar, navigate) => async (dispatch) => {
  try {
    await axios.post(`/user/company`, companyData);
    await SnackBar('Successfully added', 'success');
    await dispatch(getManageUsers(userId));
    await navigate(PATH_PAGE.upgradeUserInfoSuccess);
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const updatePlan = (id, userData, navigate) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const res = await axios.put(`/user/${id}`, userData);
    switch (res.data.code) {
      case SUCCESS:
        dispatch(getUser(id));
        navigate(PATH_DASHBOARD.user.account);
        break;
      default:
        break;
    }
  } catch (err) {
    dispatch(slice.actions.hasError(err));
  }
};

export const emailDuplicationCheck = (email, callback) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.post(`/user/existEmailCheck`, { email });
    if (response.data.data.isExist) {
      callback(EMAIL_ALREADY_EXIST);
    } else {
      callback('');
    }
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const createEndpoint = (userId, deviceToken) => async (dispatch) => {
  await axios.post(`user/createEndpoint/${userId}`, { deviceToken });
};

export const sendFenceNotification = (fenceName) => async (dispatch) => {
  await axios.post('user/sendFenceNotification', { name: fenceName });
};

export const fileManagerNotification = (companyId) => async (dispatch) => {
  await axios.post('user/filemanagerNotification', { id: companyId });
};

export const setUpgradePaymentInfo = (data) => async (dispatch) => {
  try {
    dispatch(setUpdatePaymentInfo(data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};
