import axios from 'axios';
import router from '@/router';
import store from '@/store/index';
import { ErrorBag } from 'vee-validate';

// Configure Defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

// Response Interceptors
axios.interceptors.response.use((response) => response, (error) => {

    // A 401 response indicated that are token has been invalidated
    if (error.response.status === 401) {
        router.push({ name: 'Login' });
        store.commit('clearSessionAuthToken');
        store.commit('removeAuthTokenFromLocalStorage');
    }

    return Promise.reject(error);
});

export default axios;
