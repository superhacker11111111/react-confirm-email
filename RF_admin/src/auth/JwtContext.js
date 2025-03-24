import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
import jwtDecode from 'jwt-decode';
// utils
import axios from '../utils/axios';
import localStorageAvailable from '../utils/localStorageAvailable';
//
import { isValidToken, setSession } from './utils';

import { PATH_DASHBOARD, PATH_AUTH } from '../routes/paths';

import {
  SUCCESS,
  VERIFY_CODE_INCORRECT,
  NO_EXIST,
  INVALID_USER,
  CURRENT_PASSWORD_INCORRECT,
  ALREAY_LOGGEDIN,
} from '../assets/data/resCode';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
  email: null,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }

  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext(null);

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const storageAvailable = localStorageAvailable();

  const initialize = useCallback(async () => {
    try {
      const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);
        const { id } = jwtDecode(accessToken);
        if (id) {
          const response = await axios.get(`/admin/${id}`);

          const user = response.data.data;

          dispatch({
            type: 'INITIAL',
            payload: {
              isAuthenticated: true,
              user,
            },
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
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [storageAvailable]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (loginData, navigate, Snackbar, reset) => {
    const response = await axios.post('/admin/signin', loginData);
    const res = response.data;
    switch (res.code) {
      case NO_EXIST:
        Snackbar(res.message, 'error');
        reset();
        break;

      case INVALID_USER:
        Snackbar(res.message, 'error');
        reset();
        break;

      case ALREAY_LOGGEDIN:
        Snackbar(res.message, 'error');
        reset();
        break;

      case SUCCESS:
        localStorage.setItem('current', res.data);
        Snackbar('Verification code have sent successfully', 'success');
        navigate(PATH_AUTH.phoneVerify);
        break;
      default:
        break;
    }
  }, []);

  const createPassword = useCallback(async (data, navigate, Snackbar, reset) => {
    const response = await axios.post('/auth/createPassword', data);

    switch (response.data.code) {
      case SUCCESS:
        Snackbar('The password was created', 'success');
        navigate(PATH_AUTH.login);
        break;
      case NO_EXIST:
        Snackbar('Your email is not exist', 'error');
        reset();
        break;
      default:
        break;
    }
  }, []);

  // LOGOUT
  const logout = useCallback(async (navigate, id) => {
    setSession(null);
    navigate(PATH_AUTH.login);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // PhoneVerify
  const phoneVerify = useCallback(async (data, navigate, Snackbar, reset) => {
    const response = await axios.post('/admin/phoneVerify', data);
    const res = response.data.data;
    switch (response.data.code) {
      case VERIFY_CODE_INCORRECT:
        Snackbar('The code is incorrect', 'error');
        reset();
        break;
      case NO_EXIST:
        Snackbar('The user is not exist', 'error');
        reset();
        break;
      case SUCCESS:
        setSession(res.accessToken);
        dispatch({ type: 'LOGIN', payload: { user: res.admin } });
        Snackbar('Verify Success', 'success');
        navigate(PATH_DASHBOARD.general.user.root);
        break;
      default:
        break;
    }
  }, []);

  const verify = useCallback(async (data, navigate, Snackbar, reset) => {
    const response = await axios.post('/admin/verify', data);
    const res = response.data;
    switch (res.code) {
      case VERIFY_CODE_INCORRECT:
        Snackbar(res.message, 'error');
        reset();
        break;
      case NO_EXIST:
        Snackbar(res.message, 'error');
        reset();
        break;
      case SUCCESS:
        Snackbar('Verification Success!', 'success');
        navigate(PATH_AUTH.newPassword);
        break;
      default:
        break;
    }
  }, []);

  // ForgetPassword
  const forgotPassword = useCallback(async (email, navigate, Snackbar, reset) => {
    const reponse = await axios.post('/admin/forgotPassword', { email });
    const res = reponse.data;
    switch (res.code) {
      case SUCCESS:
        localStorage.setItem('current', res.data);
        Snackbar('Your verification requst have sent successfully', 'success');
        navigate(PATH_AUTH.verify);
        break;
      case NO_EXIST:
        Snackbar(res.message, 'error');
        reset();
        break;
      default:
        break;
    }
  }, []);

  // ResetPassword
  const resetPassword = useCallback(async (data, navigate, Snackbar, reset) => {
    const response = await axios.post('/admin/resetPassword', data);
    const res = response.data;
    switch (res.code) {
      case SUCCESS:
        Snackbar('Change password success!', 'success');
        localStorage.removeItem('current');
        navigate(PATH_AUTH.login);
        break;

      case NO_EXIST:
        Snackbar(res.message, 'error');
        reset();
        break;

      default:
        break;
    }
  }, []);

  const changePassword = useCallback(async (data, navigate, Snackbar, reset) => {
    const response = await axios.post('/admin/resetPassword', data);
    const res = response.data;
    switch (res.code) {
      case SUCCESS:
        Snackbar('Change password success!', 'success');
        navigate(-1);
        break;

      case NO_EXIST:
        Snackbar(res.message, 'error');
        reset();
        break;

      case CURRENT_PASSWORD_INCORRECT:
        Snackbar(res.message, 'error');
        reset();
        break;

      default:
        break;
    }
  }, []);

  const resend = useCallback(async (data, Snackbar) => {
    const response = await axios.post('/admin/resendCode', { email: data });
    const res = response.data;
    switch (res.code) {
      case SUCCESS:
        Snackbar('Resent Code!', 'success');
        break;

      case NO_EXIST:
        Snackbar(res.message, 'error');
        break;

      default:
        break;
    }
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      method: 'jwt',
      initialize,
      login,
      logout,
      verify,
      phoneVerify,
      forgotPassword,
      resetPassword,
      createPassword,
      resend,
      changePassword,
    }),
    [
      state.isAuthenticated,
      state.isInitialized,
      state.user,
      initialize,
      login,
      logout,
      verify,
      phoneVerify,
      resetPassword,
      forgotPassword,
      createPassword,
      resend,
      changePassword,
    ]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
