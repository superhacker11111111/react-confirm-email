import axios from 'axios';

const setUserToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-user-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-user-token'];
  }
};

export default setUserToken;
