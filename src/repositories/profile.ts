import axios from '@/repositories/axios';
import { AxiosPromise } from 'axios';

export default {
    resendEmailVerificationLink(): AxiosPromise<any> {
        return axios.get('/email/resend');
    },
};
