import {
  INITIAL,
  INVALID_USER,
  VALIDATION_ERROR,
  LOGIN_SUCCESS,
  USER_IS_BANNED_ERROR,
  EMAIL_ALREADY_EXIST,
  RESET_PASSWORD_SUCCESS,
  REGISTER,
  LOGIN,
  LOGOUT,
} from '../types/types';

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const authReducer = (state = initialState, action) => {
  // const { enqueueSnackbar } = useSnackbar();
  switch (action.type) {
    case INITIAL:
      return {
        isInitialized: true,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
      };

    case REGISTER:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };

    case LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        isInitialized: true,
        user: action.payload.user,
      };

    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case VALIDATION_ERROR:
      return state;
    case USER_IS_BANNED_ERROR:
      return state;
    case EMAIL_ALREADY_EXIST:
      return {...state, isAuthenticated: false};
    case INVALID_USER:
      return state;
    case LOGIN_SUCCESS:
      return { ...state, isAuthenticated: true, isInitialized: true, user: action.payload.user };
      case RESET_PASSWORD_SUCCESS:
        return {...state, isAuthenticated: true, isInitialized: true, user: action.payload.user};
    default:
      return state;
  }
};

export default authReducer;
