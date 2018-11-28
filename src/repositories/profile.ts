import axios from '@/repositories/axios';
import { AxiosPromise } from 'axios';

export default {
    resendEmailVerificationLink(): AxiosPromise<any> {
        return axios.get('/email/resend');
    },
    verifyEmail(verification: any): AxiosPromise<any> {
        return axios.get(`/email/verify/${verification.code}`);
    }
};
