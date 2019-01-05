import axios from '@/repositories/axios';
import { AxiosPromise } from 'axios';
import { Notebook, NotebookPage } from '@/types';

export default {
  index(notebookId: string): AxiosPromise<any> {
    return axios.get(`/notebooks/${notebookId}/pages`);
  },

  create(notebookId: string, content: string): AxiosPromise<any> {
    return axios.post(`/notebooks/${notebookId}/pages`, { content });
  },

//   show(hashid: string): AxiosPromise<any> {
//     return axios.get(`/notebooks/${hashid}`);
//   },

  update(notebookId: string, pageId: string, content: string): AxiosPromise<any> {
    return axios.put(`/notebooks/${notebookId}/pages/${pageId}`, { content });
  },

  delete(notebookId: string, pageId: string): AxiosPromise<any> {
    return axios.delete(`/notebooks/${notebookId}/pages/${pageId}`);
  },
};
