import { api } from './api';

export interface Question {
  _id: string;
  question: string;
  subject: string | null;
  topic: string;
  askedBy: string;
  askerName: string;
  answer: string;
  answeredBy: string;
  status: 'pending' | 'answered';
  createdAt: string;
}

export const questionService = {
  getAll() {
    return api.request<Question[]>('/questions');
  },

  getMine() {
    return api.request<Question[]>('/questions/mine');
  },

  ask(question: string, subjectId?: string, topic?: string) {
    return api.request<Question>('/questions', {
      method: 'POST',
      body: JSON.stringify({ question, subjectId, topic }),
    });
  },

  answer(id: string, answer: string) {
    return api.request<Question>(`/questions/${id}/answer`, {
      method: 'PUT',
      body: JSON.stringify({ answer }),
    });
  },
};
