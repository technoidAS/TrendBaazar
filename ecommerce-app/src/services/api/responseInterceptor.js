import { STORAGE_KEYS } from '../../utils/constants';

export const responseInterceptor = {
  onFulfilled: (response) => {
    return response;
  },
  
  onRejected: (error) => {
    // If unauthenticated (401), force log out the user
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.USER);

      // Don't redirect if already on login page
      if (!window.location.pathname.startsWith('/login')) {
        window.location.replace('/login?expired=true');
      }
    }
    
    return Promise.reject(error);
  }
};

export default responseInterceptor;
