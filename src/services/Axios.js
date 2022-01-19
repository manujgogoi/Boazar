/**
 * @format
 * @flow strict-local
 */

import axios from 'axios';
import jwt_decode from 'jwt-decode';
import {BASE_URL, REFRESH_TOKEN_URL} from '../utils/urls';
import {storeTokens, getTokens} from '../services/encryptedStorage';

let tokens = getTokens()
  .then(res => res)
  .catch(err => console.log('Get Tokens error :', err));

let axiosInstance = axios.create();

// Add request interceptor
axiosInstance.interceptors.request.use(
  async config => {
    const tokens = await getTokens();
    if (tokens) {
      // console.log('axiosInstance request : ', tokens);
      config.headers['Authorization'] = 'Bearer ' + tokens.access;
    }
    return config;
  },
  error => {
    Promise.reject(error);
  },

  // config => {
  //   const accessToken = getTokens()
  //     .then(res => res.access)
  //     .catch(err =>
  //       console.log('Get Tokens error (Interceptor.request) :', err),
  //     );
  //   if (accessToken) {
  //     config.headers['Authorization'] = 'Bearer ' + accessToken;
  //   }
  //   return config;
  // },
  // error => {
  //   Promise.reject(error);
  // },
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (typeof error.response === 'undefined') {
      console.log(error);
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      originalRequest.url === REFRESH_TOKEN_URL
    ) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const tokens = await getTokens();
      if (tokens) {
        const tokenParts = jwt_decode(tokens.refresh);
        // exp date in token is expressed in seconds; while now() returns milliseconds
        const now = Math.ceil(Date.now() / 1000);
        if (tokenParts.exp > now) {
          return axiosInstance
            .post(REFRESH_TOKEN_URL, {
              refresh: tokens.refresh,
            })
            .then(response => {
              storeTokens(response.data.access, tokens.refresh);
              axiosInstance.defaults.headers[
                'Authorization'
              ] = `Bearer ${response.data.access}`;
              originalRequest.headers[
                'Authorization'
              ] = `Bearer ${response.data.access}`;

              return axiosInstance(originalRequest);
            })
            .catch(error => {
              return axiosInstance(originalRequest);
            });
        } else {
          console.log('Refresh token is expired ', tokenParts.exp, now);
        }
      } else {
        console.log('Refresh token is not available');
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
