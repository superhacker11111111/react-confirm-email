import axios from '../../utils/axios';
import {
  SUCCESS,
  // BAD_REQUEST,
  // INTERNAL_SERVER_ERROR,
  // ALREADY_EXIST,
  // CREATED,
  // USER_NOT_VERIFIED,
  // VERIFY_CODE_INCORRECT,
  // USER_IS_BANNED,
  // PASSWORD_NOT_MATCH,
  // NO_EXIST,
  // PASSWORD_NOT_EQUAL,
} from '../../assets/data/resCode';

export const contactMessage = (contactData, navigate, SnackBar, reset) => async (dispatch) => {
  try {
    const response = await axios.post('./contact', contactData);
    if (response.data.code === SUCCESS) {
      SnackBar('Mail has been sent correctly.', 'success');
      reset();
      // navigate(PATH_DASHBOARD.general.contactus);
    } else {
      SnackBar('Server Error!', 'error');
    }
  } catch (error) {
    console.log(error);
  }
};
