import { api } from './api';

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  department: string;
  token: string;
}

export const authService = {
  register(name: string, email: string, password: string, role: string, department: string) {
    return api.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role, department }),
    });
  },

  login(email: string, password: string) {
    return api.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getMe() {
    return api.request<AuthResponse>('/auth/me');
  },
};
