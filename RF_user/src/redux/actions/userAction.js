// utils
import axios from '../../utils/axios';
// routes
import { PATH_DASHBOARD, PATH_ONBOARDING } from '../../routes/paths';
import {
  CREATE_USER_SUCCESS,
  DELETE_MULTIPLE_USER_SUCCESS,
  GET_ALL_USERS_SUCCESS,
  SERVER_ERROR,
  EMAIL_ALREADY_EXIST,
  GET_USER_SUCCESS,
  DELETE_USER_SUCCESS,
  // UPDATE_PROFILE_SUCCESS,
} from '../types/types';
import {
  ALREADY_EXIST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NO_EXIST,
  SUCCESS,
  VALIDATION_ERROR,
} from '../../assets/data/resCode';
import { initialize } from './authAction';

function createUser(userData, navigate) {
  return (dispatch) => {
    axios
      .post('/user', { data: userData })
      .then((res) => {
        if (res.data.code === CREATED) dispatch({ type: CREATE_USER_SUCCESS });
        dispatch(getUsers());
        navigate(PATH_DASHBOARD.user.list);
      })
      .catch((err) => {
        switch (err.code) {
          case ALREADY_EXIST:
            dispatch({ type: EMAIL_ALREADY_EXIST, payload: err.message });
            break;
          case SERVER_ERROR:
            dispatch({ type: INTERNAL_SERVER_ERROR, payload: err.message });
            break;
          case VALIDATION_ERROR:
            dispatch({ type: VALIDATION_ERROR, payload: err.message });
            break;
          default:
            break;
        }
      });
  };
}

function addUsers(id, userData, Snackbar, navigate) {
  return (dispatch) => {
    axios
      .put(`/user/addUsers/${id}`, userData)
      .then((res) => {
        const response = res.data.data;
        switch (res.data.code) {
          case SUCCESS:
            Snackbar(`The ${response.new} users added succesfully!`, 'success');
            navigate(PATH_ONBOARDING.onboarding.selectfencesp);
            break;
          case ALREADY_EXIST:
            Snackbar(`The ${response.new} users added succesfully!`, 'success');
            Snackbar(`The ${response.already} users are already Exist!`, 'error');
            break;
          default:
            break;
        }
      })
      .catch((err) => Snackbar('Server Error', 'error'));
  };
}

function getUsers() {
  return (dispatch) => {
    axios
      .get('/user')
      .then((res) => {
        if (res.data.code === SUCCESS)
          dispatch({ type: GET_ALL_USERS_SUCCESS, payload: res.data.data });
      })
      .catch((err) => {
        switch (err.code) {
          case SERVER_ERROR:
            dispatch({ type: INTERNAL_SERVER_ERROR, payload: err.message });
            // snackbar('Server Error', { variant: 'error' });
            break;
          default:
            break;
        }
      });
  };
}

function getUser(id) {
  return (dispatch) => {
    axios
      .get(`/user/${id}`)
      .then((res) => {
        if (res.data.code === SUCCESS && res.data.data !== undefined) {
          dispatch({ type: GET_USER_SUCCESS, payload: res.data.data });
          // dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: res.data.data });
        }
      })
      .catch((err) => {
        switch (err.code) {
          case SERVER_ERROR:
            dispatch({ type: INTERNAL_SERVER_ERROR, payload: err.message });
            // enqueueSnackbar('Internal Server Error', { variant: 'error' });
            break;
          default:
            break;
        }
      });
  };
}

function updateUser(id, userData, Snackbar, navigate) {
  return (dispatch) => {
    axios
      .put(`/user/${id}`, userData)
      .then((res) => {
        switch (res.data.code) {
          case SUCCESS:
            dispatch({ type: GET_USER_SUCCESS, payload: userData });
            Snackbar('Succesfully updated!', 'success');
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
}

function deleteUser(id) {
  return (dispatch) => {
    axios
      .put(`/user/delete/${id}`)
      .then((res) => {
        if (res.data.code === SUCCESS) dispatch({ type: DELETE_USER_SUCCESS });
        dispatch(getUsers());
      })
      .catch((err) => {
        switch (err.code) {
          case SERVER_ERROR:
            dispatch({ type: INTERNAL_SERVER_ERROR, payload: err.message });
            // enqueueSnackbar('Internal Server Error', { variant: 'error' });
            break;
          default:
            break;
        }
      });
  };
}

function deleteUsers(ids) {
  return (dispatch) => {
    axios
      .put(`/user/users/delete`, { ids })
      .then((res) => {
        if (res.data.code === SUCCESS) dispatch({ type: DELETE_MULTIPLE_USER_SUCCESS });
        dispatch(getUsers());
      })
      .catch((err) => {
        switch (err.code) {
          case SERVER_ERROR:
            dispatch({ type: INTERNAL_SERVER_ERROR, payload: err.message });
            // enqueueSnackbar('Internal Server Error', { variant: 'error' });
            break;
          default:
            break;
        }
      });
  };
}

function createProfile(profile, Snackbar, navigate, reset) {
  return (dispatch) => {
    axios
      .post(`/user/createProfile`, profile)
      .then((res) => {
        switch (res.data.code) {
          case SUCCESS:
            Snackbar('Profile Registration Success', 'success');
            navigate(PATH_ONBOARDING.onboarding.selectfencesp);
            break;
          case NO_EXIST:
            Snackbar('User Not Exist', 'error');
            reset();
            break;
          default:
            break;
        }
      })
      .catch((err) => {
        dispatch({ type: INTERNAL_SERVER_ERROR, payload: err.message });
        Snackbar('Internal Server Error', 'error');
        reset();
      });
  };
}

function updateFences(id, userData, navigate, handleSaveError) {
  return (dispatch) => {
    axios
      .put(`/user/updateFences/${id}`, userData)
      .then((res) => {
        if (res.data.code === SUCCESS) {
          navigate(
            localStorage.getItem('layout') === 'onboarding'
              ? PATH_ONBOARDING.onboarding.downloadApp
              : PATH_DASHBOARD.user.account
          );
        } else {
          handleSaveError(res.data.message);
        }
      })
      .catch((err) => {
        dispatch({ type: INTERNAL_SERVER_ERROR, payload: err.message });
        handleSaveError(err.message);
      });
  };
}

function updatePlan(id, userData, navigate) {
  return (dispatch) => {
    axios
      .put(`/user/${id}`, userData)
      .then((res) => {
        if (res.data.message === 'Success') {
          // dispatch({ type: GET_USER_SUCCESS, payload: res.data.data });
          dispatch(initialize());
          navigate(PATH_DASHBOARD.user.plancongratulation);
        }
      })
      .catch((err) => {
        dispatch({ type: INTERNAL_SERVER_ERROR, payload: err.message });
        // enqueueSnackbar('Internal Server Error', { variant: 'error' });
      });
  };
}

function updatePlanAlmost(id, userData, navigate) {
  return (dispatch) => {
    axios
      .put(`/user/${id}`, userData)
      .then((res) => {
        console.log(res.data.message);
        if (res.data.message === 'Success') {
          navigate(PATH_ONBOARDING.onboarding.almostcongratulation);
        }
      })
      .catch((err) => {
        dispatch({ type: INTERNAL_SERVER_ERROR, payload: err.message });
        // enqueueSnackbar('Internal Server Error', { variant: 'error' });
      });
  };
}

export const userAction = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  deleteUsers,
  createProfile,
  addUsers,
  updateFences,
  updatePlan,
  updatePlanAlmost,
};
