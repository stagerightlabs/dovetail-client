import axios from '@/repositories/axios';
import { AxiosPromise } from 'axios';

export default {
  index(notebookId: string, pageId: string): AxiosPromise<any> {
    return axios.get(`/notebooks/${notebookId}/pages/${pageId}/documents`);
  },
  store(notebookId: string, pageId: string, attachment: File): AxiosPromise<any> {
    let data = new FormData();
    data.append('attachment', attachment);

    return axios.post(`/notebooks/${notebookId}/pages/${pageId}/documents`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
  },
  delete(notebookId: string, pageId: string, documentId: string) {
      return axios.delete(`/notebooks/${notebookId}/pages/${pageId}/documents/${documentId}`);
  }
//   update(notebookId: string, pageId: string, commentId: string, content: string): AxiosPromise<any> {
//     return axios.put(`/notebooks/${notebookId}/pages/${pageId}/comments/${commentId}`, {
//       content,
//     });
//   },
};
