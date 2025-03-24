// utils
import axios from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// import { dispatch } from '../store';
import {
  CREATE_USER_SUCCESS,
  DELETE_MULTIPLE_USER_SUCCESS,
  GET_ALL_USERS_SUCCESS,
  SERVER_ERROR,
  UPDATE_USER_SUCCESS,
  EMAIL_ALREADY_EXIST,
  GET_USER_SUCCESS,
  DELETE_USER_SUCCESS,
} from '../types/types';
import {
  ALREADY_EXIST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  SUCCESS,
  VALIDATION_ERROR,
} from '../../assets/data/resCode';

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
        if (res.data.code === SUCCESS) dispatch({ type: GET_USER_SUCCESS, payload: res.data.data });
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

function updateUser(id, userData, navigate) {
  return (dispatch) => {
    axios
      .put(`/user/${id}`, { userData })
      .then((res) => {
        if (res.data.code === SUCCESS) dispatch({ type: UPDATE_USER_SUCCESS });
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
            // enqueueSnackbar('Internal Server Error', { variant: 'error' });
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

export const userAction = { createUser, getUsers, getUser, updateUser, deleteUser, deleteUsers };
