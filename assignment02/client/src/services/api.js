import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile')
};

// NPC API
export const npcAPI = {
  getAll: (params) => api.get('/npcs', { params }),
  getById: (id) => api.get(`/npcs/${id}`),
  create: (data) => api.post('/npcs', data),
  update: (id, data) => api.put(`/npcs/${id}`, data),
  delete: (id) => api.delete(`/npcs/${id}`)
};

// Quest API
export const questAPI = {
  getAll: (params) => api.get('/quests', { params }),
  getById: (id) => api.get(`/quests/${id}`),
  create: (data) => api.post('/quests', data),
  update: (id, data) => api.put(`/quests/${id}`, data),
  delete: (id) => api.delete(`/quests/${id}`)
};

export default api;