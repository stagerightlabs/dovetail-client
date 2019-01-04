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

//   update(notebook: Notebook): AxiosPromise<any> {
//     return axios.put(`/notebooks/${notebook.hashid}`, notebook);
//   },

//   delete(notebook: Notebook): AxiosPromise<any> {
//     return axios.delete(`/notebooks/${notebook.hashid}`);
//   },
};
