import jwtDecode from 'jwt-decode';
// import { setSwapAvailable } from '../slices/product';
import { isValidToken, setSession } from '../../auth/utils';
import {
  // MESSAGE TYPE
  ERROR,
  SUCCESS as SUCCESS_MESSAGE,

  // ERROR MESSAGES
  USRE_NOT_EXITS,
  PASSWORD_INCORRECT,
  USER_IS_BANNED as USER_IS_BANNED_MESSAGE,
  EMAIL_PASSWORD_REQUIRED,
  USER_NOT_VERIFIED as USER_NOT_VERIFIED_MESSAGE,
  VALIDATION_ERROR as VALIDATION_ERROR_MESSAGE,
  EMAIL_ALREADY_EXIST,
  EMAIL_NO_EXIST,
  CONFIRM_PASSWORD_INCORRECT,
  SERVER_ERROR as SERVER_ERROR_MESSAGE,
  CONFIRM_PAYMENT_USER_EXIST,

  // SUCCESS MESSAGES
  USER_REGISTER,
  USER_UPDATED,
  USER_CREATED,
  PASSWORD_CREATED,
  PASSWORD_CHAANGED,
  VERIFICATION_SENT,
  VERIFICATION_RESENT,

  // SYSTEM ALERT
  CHECK_CONNECTION,
} from '../../assets/data/message';

// utils
import axios from '../../utils/axios';

// routes
import { PATH_DASHBOARD, PATH_AUTH, PATH_PAGE, PATH_ONBOARDING } from '../../routes/paths';
import {
  LOGIN_SUCCESS,
  INITIAL,
  VALIDATION_ERROR,
  SERVER_ERROR,
  RESET_PASSWORD_SUCCESS,
  GET_USER_SUCCESS,
  GET_MANAGE_SUCCESS,
  // UPDATE_PROFILE_SUCCESS,
} from '../types/types';

import {
  BAD_REQUEST,
  SUCCESS,
  INTERNAL_SERVER_ERROR,
  ALREADY_EXIST,
  CREATED,
  USER_NOT_VERIFIED,
  VERIFY_CODE_INCORRECT,
  USER_IS_BANNED,
  PASSWORD_NOT_MATCH,
  NO_EXIST,
  PASSWORD_NOT_EQUAL,
} from '../../assets/data/resCode';
import localStorageAvailable from '../../utils/localStorageAvailable';
import { ShopperRole, UserType } from '../../assets/data/roles';

const storageAvailable = localStorageAvailable();

export function initialize() {
  return (dispatch) => {
    const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';
    if (accessToken && isValidToken(accessToken)) {
      setSession(accessToken);
      const { id } = jwtDecode(accessToken);
      axios
        .get(`/auth/initialize/${id}`)
        .then((response) => {
          dispatch({
            type: INITIAL,
            payload: {
              isAuthenticated: true,
              user: response.data.data,
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

export function login(loginData, navigate, snackbar, reset) {
  return async (dispatch) => {
    await axios
      .post('/auth/signin', loginData)
      .then((response) => {
        const user = response.data.data;
        switch (response.data.code) {
          case BAD_REQUEST:
            snackbar(EMAIL_PASSWORD_REQUIRED, ERROR);
            reset();
            break;
          case USER_IS_BANNED:
            snackbar(USER_IS_BANNED_MESSAGE, ERROR);
            reset();
            break;
          case PASSWORD_NOT_MATCH:
            snackbar(PASSWORD_INCORRECT, ERROR);
            reset();
            break;
          case NO_EXIST:
            snackbar(USRE_NOT_EXITS, ERROR);
            reset();
            break;
          case USER_NOT_VERIFIED:
            snackbar(USER_NOT_VERIFIED_MESSAGE, ERROR);
            navigate(PATH_AUTH.verify);
            break;
          case SUCCESS:
            setSession(user.accessToken);
            dispatch({ type: LOGIN_SUCCESS, payload: { user: user.user } });
            navigate(PATH_DASHBOARD.user.account);
            break;
          default:
            break;
        }
      })
      .catch((err) => {
        snackbar(CHECK_CONNECTION, ERROR);
        reset();
      });
  };
}

export function register(registerData, navigate, Snackbar, reset) {
  return async (dispatch) => {
    await axios
      .post('/auth/signup', registerData)
      .then(async (response) => {
        switch (response.data.code) {
          case BAD_REQUEST:
            Snackbar(VALIDATION_ERROR_MESSAGE, ERROR);
            reset(false);
            break;
          case ALREADY_EXIST:
            Snackbar(EMAIL_ALREADY_EXIST, ERROR);
            reset(false);
            break;
          case CREATED:
            sessionStorage.removeItem('email-recovery');
            localStorage.setItem('registerEmail', registerData.email);
            if (sessionStorage.getItem('registerType') === 'shopper') {
              Snackbar(USER_REGISTER, SUCCESS_MESSAGE);
            } else {
              reset(false);
              Snackbar(CONFIRM_PAYMENT_USER_EXIST, SUCCESS_MESSAGE);
            }
            navigate(PATH_AUTH.verify);
            break;
          default:
            break;
        }
      })
      .catch((err) => {
        Snackbar(CHECK_CONNECTION, ERROR);
        reset(false);
        dispatch({ type: SERVER_ERROR });
      });
  };
}

export function getUser(id) {
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
            // enqueueSnackbar('Internal Server Error', { variant: ERROR });
            break;
          default:
            break;
        }
      });
  };
}

export function updateInfoUser(id, userData, Snackbar, navigate) {
  return (dispatch) => {
    axios
      .put(`/user/info/${id}`, userData)
      .then((res) => {
        switch (res.data.code) {
          case SUCCESS:
            Snackbar(USER_UPDATED, SUCCESS_MESSAGE);
            dispatch({ type: GET_USER_SUCCESS, payload: res.data.data });
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
        Snackbar(SERVER_ERROR_MESSAGE, ERROR);
      });
  };
}

export function getManageUsers(parentId) {
  return (dispatch) => {
    axios
      .post(`/user/get/parentId`, { parentid: parentId })
      .then((res) => {
        switch (res.data.message) {
          case SUCCESS:
            dispatch({ type: GET_MANAGE_SUCCESS, payload: res.data.data });
            break;
          default:
            break;
        }
        // navigate(PATH_DASHBOARD.user.list);
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function createProfile(registerData, navigate, Snackbar, reset) {
  return async (dispatch) => {
    await axios
      .post('/user/createprofile', registerData)
      .then(async (response) => {
        const user = response.data.data;
        switch (response.data.code) {
          case BAD_REQUEST:
            dispatch({ type: VALIDATION_ERROR });
            break;
          case SUCCESS:
            if (sessionStorage.getItem('registerType') !== null) {
              setSession(user.accessToken);
              dispatch({ type: LOGIN_SUCCESS, payload: { user: user.user } });
              Snackbar(USER_CREATED, SUCCESS_MESSAGE);
              navigate(PATH_DASHBOARD.user.account);
            } else {
              navigate(PATH_PAGE.pricing);
            }
            // navigate(PATH_AUTH.verify);
            break;
          default:
            break;
        }
      })
      .catch((err) => {
        Snackbar(CHECK_CONNECTION, ERROR);
        dispatch({ type: SERVER_ERROR });
      });
  };
}

export function socialUser(data, navigate, snackbar) {
  return async (dispatch) => {
    await axios
      .post('/auth/social', data)
      .then(async (response) => {
        const user = response.data;
        switch (user.code) {
          case CREATED:
            snackbar(USER_CREATED, SUCCESS_MESSAGE);
            navigate(PATH_AUTH.verify);
            break;
          case USER_NOT_VERIFIED:
            snackbar(USER_NOT_VERIFIED_MESSAGE, SUCCESS_MESSAGE);
            navigate(PATH_AUTH.verify);
            break;
          case SUCCESS:
            setSession(user.data.accessToken);
            dispatch({ type: LOGIN_SUCCESS, payload: { user: user.data.user } });
            navigate(PATH_DASHBOARD.user.account);
            break;
          default:
            break;
        }
      })
      .catch((err) => {
        snackbar(CHECK_CONNECTION, ERROR);
        dispatch({ type: INTERNAL_SERVER_ERROR });
      });
  };
}

export function resend(snackbar) {
  return async (dispatch) => {
    await axios
      .post('/auth/resendCode', { email: localStorage.getItem('registerEmail') })
      .then((response) => {
        switch (response.data.code) {
          case NO_EXIST:
            snackbar(USRE_NOT_EXITS, ERROR);
            break;
          case SUCCESS:
            snackbar(VERIFICATION_RESENT, SUCCESS_MESSAGE);
            break;
          default:
            break;
        }
      })
      .catch((err) => {
        snackbar(CHECK_CONNECTION, ERROR);
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
  return (dispatch) => {
    axios
      .post('/auth/verify', data)
      .then((response) => {
        const userInfo = response.data.data;
        switch (response.data.code) {
          case VERIFY_CODE_INCORRECT:
            snackbar('the code is incorrect.', 'error');
            break;
          case SUCCESS:
            dispatch({ type: LOGIN_SUCCESS, payload: userInfo.user });
            setSession(userInfo.accessToken);
            snackbar('verification successful.', 'success');
            if (data?.emailType !== undefined) {
              if (userInfo.user.role === ShopperRole.code) {
                navigate(PATH_PAGE.download);
              } else if (userInfo.user.onboardingPass) {
                navigate(PATH_DASHBOARD.user.account);
              } else if (
                userInfo.user.userType === UserType.Pro ||
                userInfo.user.userType === UserType['Free Trial']
              ) {
                navigate(PATH_ONBOARDING.onboarding.selectfencesp);
              } else {
                //  navigate(PATH_ONBOARDING.onboarding.addusers);
                navigate(PATH_ONBOARDING.onboarding.selectfencesp);
              }
            } else {
              navigate(PATH_AUTH.newPassword);
            }

            break;
          default:
            break;
        }
      })
      .catch((err) => {
        snackbar(CHECK_CONNECTION, ERROR);
        reset();
      });
  };
}

export function forgotPassword(email, navigate, snackbar, reset) {
  return async (dispatch) => {
    await axios
      .post('/auth/forgotPassword', { email })
      .then((response) => {
        switch (response.data.code) {
          case SUCCESS:
            snackbar(VERIFICATION_SENT, SUCCESS_MESSAGE);
            navigate(PATH_AUTH.resetPasswordVerify);
            break;
          case NO_EXIST:
            snackbar(EMAIL_NO_EXIST, ERROR);
            reset();
            break;
          default:
            break;
        }
      })
      .catch((err) => {
        snackbar(CHECK_CONNECTION, ERROR);
        reset();
      });
  };
}

export function createPassword(data, navigate, snackbar, reset) {
  return async (dispatch) => {
    await axios
      .post('/auth/createPassword', data)
      .then((response) => {
        const res = response.data;
        switch (res.code) {
          case SUCCESS:
            snackbar(PASSWORD_CREATED, SUCCESS_MESSAGE);
            setSession(null);
            dispatch({
              type: 'LOGOUT',
            });
            navigate(PATH_AUTH.login);
            break;
          case NO_EXIST:
            snackbar(EMAIL_NO_EXIST, ERROR);
            reset();
            break;
          default:
            break;
        }
      })
      .catch((err) => {
        snackbar(CHECK_CONNECTION, ERROR);
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
            snackbar(PASSWORD_CHAANGED, SUCCESS_MESSAGE);
            setSession(res.data.accessToken);
            dispatch({ type: RESET_PASSWORD_SUCCESS, payload: { user: res.data.user } });
            navigate(PATH_DASHBOARD.user.account);
            break;
          case NO_EXIST:
            snackbar(EMAIL_NO_EXIST, ERROR);
            reset();
            break;
          case BAD_REQUEST:
            snackbar(CONFIRM_PASSWORD_INCORRECT, ERROR);
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
        snackbar(CHECK_CONNECTION, ERROR);
        reset();
      });
  };
}
