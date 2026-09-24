import { api } from './api';

export interface StudentStats {
  totalResources: number;
  totalSubjects: number;
  myQuestions: number;
  pendingQuestions: number;
}

export interface TeacherStats {
  myResources: number;
  totalResources: number;
  totalSubjects: number;
  pendingQuestions: number;
}

export const dashboardService = {
  getStudentStats() {
    return api.request<StudentStats>('/dashboard/student');
  },

  getTeacherStats() {
    return api.request<TeacherStats>('/dashboard/teacher');
  },
};
