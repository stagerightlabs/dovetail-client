import axios from '@/repositories/axios';
import { AxiosPromise } from 'axios';

export default {
    index(): AxiosPromise<any> {
        return axios.get('/invitations');
    },

    create(email: any): AxiosPromise<any> {
        return axios.post('/invitations', email);
    },
}
