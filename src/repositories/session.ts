import axios from '@/repositories/axios';
import { AxiosPromise } from 'axios';

export default {
    login(credentials: any): AxiosPromise<any> {
        return axios.post('/login', credentials);
    },

    register(registration: any): AxiosPromise<any> {
        return axios.post('/register', registration);
    },
};
