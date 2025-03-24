import jwtDecode from 'jwt-decode';
import { isValidToken, setSession } from '../../auth/utils';
// utils
import axios from '../../utils/axios';
// routes
import { PATH_DASHBOARD, PATH_AUTH } from '../../routes/paths';
// import { dispatch } from '../store';
import { LOGIN_SUCCESS, INITIAL, RESET_PASSWORD_SUCCESS } from '../types/types';

import { BAD_REQUEST, SUCCESS, VERIFY_CODE_INCORRECT, NO_EXIST } from '../../assets/data/resCode';
import localStorageAvailable from '../../utils/localStorageAvailable';

const storageAvailable = localStorageAvailable();

export function initialize() {
  return (dispatch) => {
    const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';
    if (accessToken && isValidToken(accessToken)) {
      setSession(accessToken);
      const { id } = jwtDecode(accessToken);
      axios
        .get(`/user/${id}`)
        .then((response) => {
          const user = response.data.data;

          dispatch({
            type: INITIAL,
            payload: {
              isAuthenticated: true,
              user: user.user,
            },
          });
        })
        .catch((err) => {
          dispatch({
            type: 'INITIAL',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        });
    } else {
      dispatch({
        type: 'INITIAL',
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  };
}

export function resend(snackbar, reset) {
  return async (dispatch) => {
    await axios
      .post('/auth/resendCode', { email: sessionStorage.getItem('emailsms') })
      .then((response) => {
        switch (response.data.code) {
          case NO_EXIST:
            snackbar('The user is not exist', 'error');
            reset();
            break;
          case SUCCESS:
            snackbar('Your verification requst have resent successfully', 'success');
            break;
          default:
            break;
        }
      })
      .catch((err) => {
        snackbar('Please check connection', 'error');
      });
  };
}

export function logout(navigate) {
  return async (dispatch) => {
    setSession(null);
    navigate(PATH_AUTH.login);
    dispatch({
      type: 'LOGOUT',
    });
  };
}

export function verify(data, navigate, snackbar, reset) {
  return async (dispatch) => {
    await axios
      .post('/auth/phoneVerify', data)
      .then(async (response) => {
        const user = response.data.data;
        switch (response.data.code) {
          case VERIFY_CODE_INCORRECT:
            snackbar('The code is incorrect', 'error');
            reset();
            break;
          case NO_EXIST:
            snackbar('The user is not exist', 'error');
            reset();
            break;
          case SUCCESS:
            sessionStorage.removeItem('emailsms');
            setSession(user.accessToken);
            dispatch({ type: LOGIN_SUCCESS, payload: { user: user.user } });
            snackbar('Verify Success', 'success');
            navigate(PATH_DASHBOARD.general.user.root);
            break;
          default:
            break;
        }
      })
      .catch((err) => {
        snackbar('Please check connection', 'error');
        reset();
      });
  };
}

export function forgotPassword(email, navigate, snackbar, reset) {
  return async (dispatch) => {
    axios
      .post('/auth/forgotPassword', email)
      .then((response) => {
        switch (response.data.code) {
          case SUCCESS:
            snackbar('Your verification requst have sent successfully', 'success');
            navigate(PATH_AUTH.newPassword);
            break;
          case NO_EXIST:
            snackbar('Your email is not exist', 'error');
            reset();
            break;
          default:
            break;
        }
      })
      .catch((err) => {
        snackbar('Please check connection', 'error');
        reset();
      });
  };
}

export function resetPassword(data, navigate, snackbar, reset) {
  return async (dispatch) => {
    await axios
      .post('/auth/resetPassword', data)
      .then((response) => {
        const res = response.data;
        switch (res.code) {
          case SUCCESS:
            sessionStorage.removeItem('email-recovery');
            snackbar('Change password success!', 'success');
            setSession(res.data.accessToken);
            dispatch({ type: RESET_PASSWORD_SUCCESS, payload: { user: res.data.user } });
            navigate(PATH_AUTH.login);
            break;

          case NO_EXIST:
            snackbar('Your email is not exist', 'error');
            reset();
            break;

          case BAD_REQUEST:
            snackbar('New Password and Confirm Password must be equal', 'error');
            reset();
            break;

          case VERIFY_CODE_INCORRECT:
            snackbar('Your verificode is not correct', 'error');
            reset();
            break;
          default:
            break;
        }
      })
      .catch((err) => {
        snackbar('Please check connection', 'error');
        reset();
      });
  };
}
