import axios from '@/repositories/axios';
import { AxiosPromise } from 'axios';
import { Member } from '@/types';

export default {
  index(): AxiosPromise<any> {
    return axios.get(`/members`);
  },

  deletedMembers(): AxiosPromise<any> {
    return axios.get(`/members/deleted`);
  },

  update(member: Member): AxiosPromise<any> {
    return axios.put(`/members/${member.hashid}`, {
      name: member.name,
      email: member.email,
      title: member.title,
    });
  },

  block(member: Member): AxiosPromise<any> {
    return axios.delete(`/members/${member.hashid}/block`);
  },

  unblock(member: Member): AxiosPromise<any> {
    return axios.delete(`/members/${member.hashid}/unblock`);
  },

  delete(member: Member): AxiosPromise<any> {
    return axios.delete(`/members/${member.hashid}`);
  },

  restore(member: Member): AxiosPromise<any> {
    return axios.delete(`/members/${member.hashid}/restore`);
  },

  permissions(member: Member): AxiosPromise<any> {
    return axios.get(`/members/${member.hashid}/permissions`);
  },

  updatePermissions(member: Member): AxiosPromise<any> {
    return axios.put(`/members/${member.hashid}/permissions`);
  },
};
