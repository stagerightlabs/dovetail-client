import axios from '@/repositories/axios';
import { AxiosPromise } from 'axios';

export default {
  readSetting(key: string): AxiosPromise<any> {
    return axios.get(`/organization/settings/${key}`);
  },

  writeSetting(key: string, value: string): AxiosPromise<any> {
    return axios.put(`/organization/settings`, {key, value});
  },
};
