import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import setAuthToken from '../../utils/setAuthToken';
import {
  ERROR,
  SUCCESS as SUCCESS_MESSAGE,
  // ERROR MESSAGES
  PASSWORD_INCORRECT,
  EMAIL_ALREADY_EXIST,
  SERVER_ERROR,

  // SUCCESS MESSAGES
  USER_UPDATED,
  USER_CREATED,
  USER_DELETED,
  USERS_DELETED,
  COMPANY_ADDED,
  COMPANY_DELETED,
} from '../../assets/data/message';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
import { ALREADY_EXIST, SUCCESS, PASSWORD_NOT_EQUAL } from '../../assets/data/resCode';
import { LOGIN_SUCCESS } from '../types/types';

const initialState = {
  isloading: false,
  error: null,
  user: null,
  users: [],
  companies: [],
  company: null,
  selectedFences: [],
  requestFences: [],
  filterFences: [],
  planCount: 0,
  totalCount: {
    totalCount: 0,
    notStarted: 0,
    pending: 0,
    completed: 0,
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
      state.isLoading = false;
      state.users = action.payload;
    },

    getUserSuccess(state, action) {
      state.isloading = false;
      state.user = action.payload;
    },

    getManageUsersSuccess(state, action) {
      state.isloading = false;
      state.companies = action.payload;
    },

    getdeleteUsersSuccess(state, action) {
      state.isloading = false;
      state.companies = action.payload;
    },

    getCompanySuccess(state, action) {
      state.isloading = false;
      state.company = action.payload.company;
      state.filterFences = action.payload.filteredFences;
      state.selectedFences = action.payload.selectedFences;
      state.requestFences = action.payload.requestFences;
      state.planCount = action.payload.planCount;
      state.totalCount = {
        totalCount: action.payload.totalCount,
        notStarted: action.payload.notStarted,
        pending: action.payload.pending,
        completed: action.payload.completed,
      };
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
  getManageUsersSuccess,
  getdeleteUsersSuccess,
  getCompanySuccess,
  setUpdatePaymentInfo,
} = slice.actions;

export function getUsers() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      setAuthToken(localStorage.getItem('token'));
      const response = await axios.get('/user/list');
      dispatch(slice.actions.getUsersSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export const getCompany = (searchParams) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`/user/companies/file?${searchParams}`);
    dispatch(slice.actions.getCompanySuccess(response.data.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getUser = (id) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`/user/${id}`);
    if (response.data.data) {
      localStorage.setItem(
        'notificationSetting',
        JSON.stringify(response.data.data.notificationSetting)
      );
      dispatch(slice.actions.getUserSuccess(response.data.data));
    }
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export function addUser(userData, snackbar, navigate) {
  axios
    .post('/user/add', {
      userData,
    })
    .then((res) => {
      snackbar(USER_CREATED, { variant: SUCCESS_MESSAGE });
      navigate(PATH_DASHBOARD.user.list);
    })
    .catch((err) => {
      switch (err.data.message) {
        case 'Email already exists':
          snackbar(EMAIL_ALREADY_EXIST, {
            variant: ERROR,
          });
          break;
        default:
          snackbar(SERVER_ERROR, {
            variant: ERROR,
          });
          break;
      }
    });
}

export const updateUser = (id, userData, Snackbar, navigate) => (dispatch) => {
  axios
    .put(`/user/${id}`, userData)
    .then((res) => {
      switch (res.data.code) {
        case SUCCESS:
          Snackbar(USER_CREATED, SUCCESS_MESSAGE);
          localStorage.setItem(
            'notificationSetting',
            JSON.stringify(res.data.data.notificationSetting)
          );
          dispatch(slice.actions.getUserSuccess(res.data.data));
          // navigate(PATH_DASHBOARD.user.account);
          break;
        case ALREADY_EXIST:
          Snackbar(EMAIL_ALREADY_EXIST, ERROR);
          break;
        default:
          break;
      }
      // navigate(PATH_DASHBOARD.user.list);
      // navigate(PATH_DASHBOARD.user.account);
    })
    .catch((err) => {
      Snackbar(SERVER_ERROR, ERROR);
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

export function deleteUser(id, snackbar) {
  axios
    .delete(`/user/${id}`)
    .then((res) => {
      snackbar(USERS_DELETED, { variant: SUCCESS_MESSAGE });
    })
    .catch((err) => {
      snackbar(SERVER_ERROR, {
        variant: ERROR,
      });
    });
}

export const deleteUserByEmail = (email, snackbar) => async (dispatch) => {
  axios
    .put(`user/deleteByEmail/${email}`)
    .then((res) => {
      snackbar(USER_DELETED, SUCCESS_MESSAGE);
    })
    .catch((err) => {
      snackbar(SERVER_ERROR, {
        variant: ERROR,
      });
    });
};

export function deleteUsers(ids, snackbar) {
  axios
    .put(`/user`, { ids })
    .then((res) => {
      getUsers();
      snackbar(USERS_DELETED, { variant: SUCCESS_MESSAGE });
    })
    .catch((err) => {
      snackbar(SERVER_ERROR, {
        variant: ERROR,
      });
    });
}

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

export const addUsers = (id, emailList, SnackBar, callback) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    setAuthToken(localStorage.getItem('token'));
    const response = await axios.post(`/user/addUsers/${id}`, { emailList });
    callback(response.data);
    // if (response.data.code === 200) {
    //   navigate(PATH_ONBOARDING.onboarding.selectfencesp);
    // }
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const addCompany = (emailList, parentId, SnackBar, reset) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.put(`/user/addUsers/${parentId}`, emailList);
    if (response.data.message === 'Success') {
      SnackBar(COMPANY_ADDED, SUCCESS_MESSAGE);
      dispatch(getManageUsers(parentId));
      reset();
    }
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const deleteCompany = (id, Snackbar) => (dispatch) => {
  axios
    .put(`user/delete/${id}`)
    .then((res) => {
      Snackbar(COMPANY_DELETED, SUCCESS_MESSAGE);
    })
    .catch((err) => {
      Snackbar(SERVER_ERROR, {
        variant: ERROR,
      });
    });
};

export const updateInfoUser = (id, userData, Snackbar, navigate) => (dispatch) => {
  dispatch(slice.actions.startLoading());
  axios
    .put(`/user/info/${id}`, userData)
    .then((res) => {
      switch (res.data.code) {
        case SUCCESS:
          Snackbar(USER_UPDATED, SUCCESS_MESSAGE);
          dispatch(slice.actions.getUserSuccess(res.data.data));
          dispatch({ type: LOGIN_SUCCESS, payload: { user: res.data.data } });
          navigate(PATH_DASHBOARD.user.account);
          break;
        case ALREADY_EXIST:
          Snackbar(EMAIL_ALREADY_EXIST, ERROR);
          break;
        case PASSWORD_NOT_EQUAL:
          Snackbar(PASSWORD_INCORRECT, ERROR);
          break;
        default:
          break;
      }
      // navigate(PATH_DASHBOARD.user.list);
    })
    .catch((err) => {
      Snackbar(SERVER_ERROR, ERROR);
    });
};

export const emailExistCheck = (email, setError) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.post(`/user/existEmailCheck`, { email });
    if (response.data.data.isExist) {
      setError(EMAIL_ALREADY_EXIST);
    } else {
      setError('');
    }
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const shopperEmailExistCheck = (email, setError) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.post(`/user/shopperEmailExistCheck`, { email });
    if (response.data.data.isExist) {
      setError(EMAIL_ALREADY_EXIST);
    } else {
      setError('');
    }
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const emailDuplicationCheck = (email, callback) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.post(`/user/existEmailCheck`, { email });
    callback(response.data.data.isExist);
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const setUpgradePaymentInfo = (data) => async (dispatch) => {
  try {
    dispatch(setUpdatePaymentInfo(data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};
