import { STORAGE_KEYS } from '../../utils/constants';

export const requestInterceptor = {
  onFulfilled: (config) => {
    // Attempt to read token from local storage
    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      if (userStr) {
        const { token } = JSON.parse(userStr);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (e) {
      console.warn('[Request Interceptor] Failed to attach token:', e);
    }
    
    return config;
  },
  
  onRejected: (error) => {
    return Promise.reject(error);
  }
};

export default requestInterceptor;
