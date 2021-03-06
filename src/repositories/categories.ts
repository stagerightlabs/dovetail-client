import axios from '@/repositories/axios';
import { AxiosPromise } from 'axios';
import { Category } from '@/types';

export default {
  index(): AxiosPromise<any> {
    return axios.get(`/categories`);
  },

  create(name: string): AxiosPromise<any> {
    return axios.post(`/categories`, {name});
  },

  show(hashid: string): AxiosPromise<any> {
    return axios.get(`/categories/${hashid}`);
  },

  update(category: Category): AxiosPromise<any> {
    return axios.put(`/categories/${category.hashid}`, {
      name: category.name,
    });
  },

  delete(category: Category): AxiosPromise<any> {
    return axios.delete(`/categories/${category.hashid}`);
  },
};
