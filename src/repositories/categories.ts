import axios from '@/repositories/axios';
import { AxiosPromise } from 'axios';
import { Category } from '@/types';

export default {
  index(): AxiosPromise<any> {
    return axios.get(`/categories`);
  },

  create(): AxiosPromise<any> {
    return axios.post(`/categories`);
  },

  show(hashid: string): AxiosPromise<any> {
    return axios.get(`/categories/${hashid}`);
  },

  update(category: Category): AxiosPromise<any> {
    return axios.put(`/categories/${category.hashid}`);
  },

  delete(category: Category): AxiosPromise<any> {
    return axios.delete(`/categories/${category.hashid}`);
  },
};
