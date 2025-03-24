import {
  CREATE_USER_SUCCESS,
  GET_ALL_USERS_SUCCESS,
  GET_USER_SUCCESS,
  UPDATE_USER_SUCCESS,
  DELETE_USER_SUCCESS,
  DELETE_MULTIPLE_USER_SUCCESS,
} from '../types/types';

const initialState = {
  isloading: true,
  error: false,
  users: [],
  user: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_USER_SUCCESS:
      return state;
    case GET_ALL_USERS_SUCCESS:
      return { ...state, users: action.payload, isloading: false };
    case GET_USER_SUCCESS:
      return { ...state, user: action.payload, isloading: false };
    case UPDATE_USER_SUCCESS:
      return state;
    case DELETE_USER_SUCCESS:
      return state;
    case DELETE_MULTIPLE_USER_SUCCESS:
      return state;
    default:
      return state;
  }
};

export default userReducer;
