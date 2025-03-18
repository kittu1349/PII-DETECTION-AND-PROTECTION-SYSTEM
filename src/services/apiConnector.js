import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:4000",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiConnector = async (method, url, bodyData, headers = {}, params = null) => {
  const config = {
    method: method,
    url: url,
    params: params || null,
    headers: { ...headers },
  };

  if (bodyData instanceof FormData) {
    config.data = bodyData;
    config.headers['Content-Type'] = 'multipart/form-data';
  } else if (bodyData) {
    config.data = bodyData;
  }

  try {
    const response = await axiosInstance(config);
    console.log(`API Response from ${url}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`API Error from ${url}:`, error.response || error);
    throw error;
  }
};

// utils/apiConnector.js

// import axios from 'axios';

// const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

// export const apiConnector = async (method, url, bodyData, headers) => {
//   try {
//     const response = await axios({
//       method,
//       url: `${BASE_URL}${url}`,
//       data: bodyData,
//       headers: {
//         'Content-Type': 'application/json',
//         ...headers,
//       },
//     });

//     console.log(`API Response from ${url}:`, response.data);
//     return response;
//   } catch (error) {
//     console.error(`API Error from ${url}:`, error);
//     throw error;
//   }
// };