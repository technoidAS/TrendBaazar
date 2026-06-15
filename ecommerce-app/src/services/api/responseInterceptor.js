import { STORAGE_KEYS } from '../../utils/constants';

export const responseInterceptor = {
  onFulfilled: (response) => {
    return response;
  },
  
  onRejected: (error) => {
    // If unauthenticated (401), force log out the user
    if (error.response && error.response.status === 401) {
      console.warn('[Response Interceptor] 401 Unauthorized detected. Clearing session.');
      try {
        localStorage.removeItem(STORAGE_KEYS.USER);
        // Force redirect to login if browser context permits
        if (typeof window !== 'undefined') {
          window.location.href = '/login?expired=true';
        }
      } catch (e) {
        console.error('[Response Interceptor] Error logging out:', e);
      }
    }
    
    return Promise.reject(error);
  }
};

export default responseInterceptor;
