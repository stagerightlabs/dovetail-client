import axios from '@/repositories/axios';
import { AxiosPromise } from 'axios';

export default {
  index(notebookId: string): AxiosPromise<any> {
    return axios.get(`/notebooks/${notebookId}/pages`);
  },

  create(notebookId: string, content: string): AxiosPromise<any> {
    return axios.post(`/notebooks/${notebookId}/pages`, { content });
  },

  update(notebookId: string, pageId: string, content: string): AxiosPromise<any> {
    return axios.put(`/notebooks/${notebookId}/pages/${pageId}`, { content });
  },

  delete(notebookId: string, pageId: string): AxiosPromise<any> {
    return axios.delete(`/notebooks/${notebookId}/pages/${pageId}`);
  },

  fetchActivity(notebookId: string, pageId: string): AxiosPromise<any> {
    return axios.get(`/notebooks/${notebookId}/pages/${pageId}/activity`);
  },
};
