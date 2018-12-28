import axios from '@/repositories/axios';
import { AxiosPromise } from 'axios';
import { User } from '@/types';

export default {

  resendEmailVerificationLink(): AxiosPromise<any> {
    return axios.get('/email/resend');
  },

  verifyEmail(verification: any): AxiosPromise<any> {
    return axios.get(`/email/verify/${verification.code}`);
  },

  updateProfile(profile: User): AxiosPromise<any> {
    return axios.put(`/user`, {
      name: profile.name,
      email: profile.email,
      // phone: profile.phone || '',
    });
  },

  teams(): AxiosPromise<any> {
    return axios.get(`/user/teams`);
  },
};
