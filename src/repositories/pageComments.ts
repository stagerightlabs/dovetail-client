import axios from '@/repositories/axios';
import { AxiosPromise } from 'axios';

export default {
  store(notebookId: string, pageId: string, content: string): AxiosPromise<any> {
    return axios.post(`/notebooks/${notebookId}/pages/${pageId}/comments`, {
      content,
    });
  },
  update(notebookId: string, pageId: string, commentId: string, content: string): AxiosPromise<any> {
    return axios.put(`/notebooks/${notebookId}/pages/${pageId}/comments/${commentId}`, {
      content,
    });
  },
};
