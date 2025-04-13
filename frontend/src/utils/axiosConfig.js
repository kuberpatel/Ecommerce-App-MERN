import axios from 'axios';

// Add response interceptor
axios.interceptors.response.use(
  (response) => {
    // If the response indicates not authorized
    if (response.data?.success === false && response.data?.message === 'Not Authorized Login Again') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios; 