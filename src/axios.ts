import router from '@/router';

import axios from 'axios';

// Configure Defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

export default axios;
