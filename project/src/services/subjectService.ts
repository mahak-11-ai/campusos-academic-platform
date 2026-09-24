import { api } from './api';

export interface Subject {
  _id: string;
  name: string;
  code: string;
  description: string;
}

export const subjectService = {
  getAll() {
    return api.request<Subject[]>('/subjects');
  },

  getById(id: string) {
    return api.request<Subject>(`/subjects/${id}`);
  },

  create(name: string, code: string, description: string) {
    return api.request<Subject>('/subjects', {
      method: 'POST',
      body: JSON.stringify({ name, code, description }),
    });
  },
};
