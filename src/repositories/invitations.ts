import axios from '@/repositories/axios';
import { Invitation } from '@/types';
import { AxiosPromise } from 'axios';

export default {
  index(): AxiosPromise<any> {
    return axios.get('/invitations');
  },

  create(email: any): AxiosPromise<any> {
    return axios.post('/invitations', email);
  },

  resend(invitation: Invitation): AxiosPromise<any> {
    return axios.post(`/invitations/${invitation.hashid}/resend`);
  },

  revoke(invitation: Invitation): AxiosPromise<any> {
    return axios.post(`/invitations/${invitation.hashid}/revoke`);
  },

  restore(invitation: Invitation): AxiosPromise<any> {
    return axios.delete(`/invitations/${invitation.hashid}/revoke`);
  },

  delete(invitation: Invitation): AxiosPromise<any> {
    return axios.delete(`/invitations/${invitation.hashid}`);
  },
};
