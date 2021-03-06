import axios from '@/repositories/axios';
import { AxiosPromise } from 'axios';
import { Team, Member } from '@/types';

export default {
  index(): AxiosPromise<any> {
    return axios.get(`/teams`);
  },

  create(name: string): AxiosPromise<any> {
    return axios.post(`/teams`, { name });
  },

  show(hashid: string): AxiosPromise<any> {
    return axios.get(`/teams/${hashid}`);
  },

  update(team: Team, name: string): AxiosPromise<any> {
    return axios.put(`/teams/${team.hashid}`, { name });
  },

  delete(team: Team): AxiosPromise<any> {
    return axios.delete(`/teams/${team.hashid}`);
  },

  addMember(team: Team, member: Member): AxiosPromise<any> {
    return axios.post(`/teams/${team.hashid}/members`, {
      member: member.hashid,
    });
  },

  removeMember(team: Team, member: Member): AxiosPromise<any> {
    return axios.delete(`/teams/${team.hashid}/members/${member.hashid}`);
  },
};
