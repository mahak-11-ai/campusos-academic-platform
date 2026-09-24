import { api } from './api';

export type ResourceType = 'notes' | 'previous-paper' | 'assignment' | 'reference';

export interface Resource {
  _id: string;
  title: string;
  description: string;
  subject: string;
  subjectName: string;
  topic: string;
  resourceType: ResourceType;
  fileName: string;
  filePath: string;
  fileUrl: string;
  uploadedBy: string;
  uploaderName: string;
  createdAt: string;
}

export interface ResourceFilters {
  subject?: string;
  topic?: string;
  type?: string;
  search?: string;
}

export const resourceService = {
  getAll(filters: ResourceFilters = {}) {
    const params = new URLSearchParams();
    if (filters.subject) params.set('subject', filters.subject);
    if (filters.topic) params.set('topic', filters.topic);
    if (filters.type) params.set('type', filters.type);
    if (filters.search) params.set('search', filters.search);
    const qs = params.toString();
    return api.request<Resource[]>(`/resources${qs ? `?${qs}` : ''}`);
  },

  getLatest() {
    return api.request<Resource[]>('/resources/latest');
  },

  getById(id: string) {
    return api.request<Resource>(`/resources/${id}`);
  },

  getMine() {
    return api.request<Resource[]>('/resources/mine');
  },

  create(data: {
    title: string;
    description: string;
    subjectId: string;
    topic: string;
    resourceType: ResourceType;
    fileUrl?: string;
  }, file?: File) {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('subjectId', data.subjectId);
    formData.append('topic', data.topic);
    formData.append('resourceType', data.resourceType);
    if (data.fileUrl) formData.append('fileUrl', data.fileUrl);
    if (file) formData.append('file', file);
    return api.uploadFile<Resource>('/resources', formData);
  },

  delete(id: string) {
    return api.request<{ message: string }>(`/resources/${id}`, {
      method: 'DELETE',
    });
  },
};
