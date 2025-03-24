const axios = require("axios");

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: "https://api-app2.simpletexting.com/v2",
  Headers: {
    Authorization: `Bearer ${process.env.STTOKEN}`,
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

module.exports = { axios: axiosInstance };
