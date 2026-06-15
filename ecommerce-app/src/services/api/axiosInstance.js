import axios from 'axios';
import requestInterceptor from './requestInterceptor';
import responseInterceptor from './responseInterceptor';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.trendbaazar.mock/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Interceptors
axiosInstance.interceptors.request.use(
  requestInterceptor.onFulfilled,
  requestInterceptor.onRejected
);

axiosInstance.interceptors.response.use(
  responseInterceptor.onFulfilled,
  responseInterceptor.onRejected
);

export default axiosInstance;
