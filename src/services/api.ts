import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// TypeScript interfaces
export interface User {
  _id: string;
  username: string;
  email: string;
  favorites: string[];
  playHistory: Array<{
    playgroundId: string;
    playedAt: string;
    duration: number;
  }>;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    unlockedAt: string;
  }>;
  createdAt: string;
}

export interface Playground {
  _id: string;
  title: string;
  description: string;
  author: {
    _id: string;
    username: string;
    email: string;
  };
  gameData: any;
  thumbnail?: string;
  tags: string[];
  genre: 'action' | 'puzzle' | 'platformer' | 'rpg' | 'strategy' | 'arcade' | 'simulation' | 'adventure' | 'educational';
  playCount: number;
  rating: {
    average: number;
    count: number;
  };
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProgress {
  _id: string;
  userId: string;
  playgroundId: string;
  score: number;
  progress: number;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    unlockedAt: string;
  }>;
  lastPlayed: string;
  totalTimeSpent: number;
  bestScore: number;
  completionCount: number;
}

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
  getAll: () => api.get<Playground[]>('/playgrounds'),
  getById: (id: string) => api.get<Playground>(`/playgrounds/${id}`),
  create: (data: {
    title: string;
    description: string;
    gameData: any;
    thumbnail?: string;
    tags?: string[];
    genre?: string;
  }) => api.post<Playground>('/playgrounds', data),
  update: (id: string, data: Partial<Playground>) => api.put<Playground>(`/playgrounds/${id}`, data),
  delete: (id: string) => api.delete(`/playgrounds/${id}`),
  play: (id: string) => api.post(`/playgrounds/${id}/play`),
};

export const userProgressAPI = {
  getProgress: (userId: string) => api.get<UserProgress[]>(`/users/${userId}/progress`),
  updateProgress: (userId: string, playgroundId: string, data: {
    score?: number;
    progress?: number;
    achievements?: Array<{
      id: string;
      name: string;
      description: string;
    }>;
    duration?: number;
  }) => api.put<UserProgress>(`/users/${userId}/progress/${playgroundId}`, data),
};

export const adminAPI = {
  // Admin playground management
  createPlayground: (data: {
    title: string;
    description: string;
    gameData: any;
    thumbnail?: string;
    tags?: string[];
    genre?: string;
    featured?: boolean;
  }) => api.post<Playground>('/admin/playgrounds', data),
  updatePlayground: (id: string, data: Partial<Playground>) => api.put<Playground>(`/admin/playgrounds/${id}`, data),
  deletePlayground: (id: string) => api.delete(`/admin/playgrounds/${id}`),
  featurePlayground: (id: string, featured: boolean) => api.put<Playground>(`/admin/playgrounds/${id}/feature`, { featured }),

  // Admin user management
  getUsers: () => api.get<User[]>('/admin/users'),
  manageUser: (userId: string, action: 'ban' | 'unban' | 'promote' | 'demote') =>
    api.put(`/admin/users/${userId}`, { action }),

  // Admin analytics
  getAnalytics: () => api.get('/admin/analytics'),
};

export default api;