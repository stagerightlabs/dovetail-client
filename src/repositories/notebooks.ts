import axios from '@/repositories/axios';
import { AxiosPromise } from 'axios';
import { Notebook } from '@/types';

export default {
  index(): AxiosPromise<any> {
    return axios.get(`/notebooks`);
  },

  create(parameters: any): AxiosPromise<any> {
    return axios.post(`/notebooks`, parameters);
  },

  show(hashid: string): AxiosPromise<any> {
    return axios.get(`/notebooks/${hashid}`);
  },

  update(notebook: Notebook): AxiosPromise<any> {
    return axios.put(`/notebooks/${notebook.hashid}`, notebook);
  },

  delete(notebook: Notebook): AxiosPromise<any> {
    return axios.delete(`/notebooks/${notebook.hashid}`);
  },

  follow(notebook: Notebook): AxiosPromise<any> {
    return axios.put(`/notebooks/${notebook.hashid}/follow`);
  },

  unfollow(notebook: Notebook): AxiosPromise<any> {
    return axios.put(`/notebooks/${notebook.hashid}/unfollow`);
  },
};
