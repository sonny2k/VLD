import axios from 'axios';
// config
import { HOST_API } from '../config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: HOST_API,
  headers: {
    'content-type': 'application/json',
  }
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Đã xảy ra lỗi')
);

export default axiosInstance;
