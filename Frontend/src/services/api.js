import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// User endpoints
export const userAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (id, data) => api.put(`/users/${id}`, data),
  getAllExperts: (page = 1, limit = 10) => api.get(`/users/experts/list?page=${page}&limit=${limit}`),
  searchExperts: (skills, minRating) => {
    const params = new URLSearchParams();
    if (skills) params.append('skills', skills);
    if (minRating) params.append('minRating', minRating);
    return api.get(`/users/search/experts?${params}`);
  },
  addSkill: (userId, data) => api.post(`/users/${userId}/skills`, data),
  removeSkill: (userId, skillName) => api.delete(`/users/${userId}/skills/${skillName}`),
};

// Project endpoints
export const projectAPI = {
  createProject: (data) => api.post('/projects', data),
  getProjects: (page = 1, limit = 10) => api.get(`/projects?page=${page}&limit=${limit}`),
  getProjectById: (id) => api.get(`/projects/${id}`),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  searchProjects: (category, skills, minBudget, maxBudget) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (skills) params.append('skills', skills);
    if (minBudget) params.append('minBudget', minBudget);
    if (maxBudget) params.append('maxBudget', maxBudget);
    return api.get(`/projects/search?${params}`);
  },
  placeBid: (projectId, data) => api.post(`/projects/${projectId}/bid`, data),
};

// Skill endpoints
export const skillAPI = {
  getAllSkills: () => api.get('/skills'),
  createSkill: (data) => api.post('/skills', data),
  getSkillsByCategory: (category) => api.get(`/skills/category/${category}`),
  deleteSkill: (id) => api.delete(`/skills/${id}`),
};

export default api;
