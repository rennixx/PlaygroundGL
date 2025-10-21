import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (userData: { username: string; email: string; password: string }) =>
    api.post('/auth/register', userData),
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
};

export const playgroundAPI = {
  getAll: () => api.get('/playgrounds'),
  getById: (id: string) => api.get(`/playgrounds/${id}`),
  create: (data: any) => api.post('/playgrounds', data),
  update: (id: string, data: any) => api.put(`/playgrounds/${id}`, data),
  delete: (id: string) => api.delete(`/playgrounds/${id}`),
};

export default api;