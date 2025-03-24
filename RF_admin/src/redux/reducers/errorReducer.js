import { EMAIL_ALREADY_EXIST, SERVER_ERROR, VALIDATION_ERROR } from '../types/types';

const initialState = {
  isloading: true,
  error: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case EMAIL_ALREADY_EXIST:
      return { ...state, error: action.payload };
    case SERVER_ERROR:
      return { ...state, error: action.payload };
    case VALIDATION_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default userReducer;
