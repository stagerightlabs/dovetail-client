import axios from 'axios';
import router from '@/router';
import store from '@/store/index';

// Configure Defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

// If we have a jwt token, use it
axios.interceptors.request.use((config) => {
  if (store.getters['session/isAuthenticated']) {
    const token = store.getters['session/authToken'];
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
  // Do something with request error
}, (error) => Promise.reject(error));

// Response Interceptors
axios.interceptors.response.use((response) => response, (error) => {

  // A 401 response indicated that are token has been invalidated
  if (error.response.status === 401) {
    router.push({ name: 'logout' });
  }

  return Promise.reject(error);
});

export default axios;
