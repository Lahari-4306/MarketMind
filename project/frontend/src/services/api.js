import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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

export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

export const campaignService = {
  getAll: (skip = 0, limit = 100) => api.get(`/campaigns/?skip=${skip}&limit=${limit}`),
  getById: (id) => api.get(`/campaigns/${id}`),
  create: (data) => api.post('/campaigns/', data),
  update: (id, data) => api.put(`/campaigns/${id}`, data),
  delete: (id) => api.delete(`/campaigns/${id}`),
};

export const salesPitchService = {
  getAll: (skip = 0, limit = 100) => api.get(`/sales-pitches/?skip=${skip}&limit=${limit}`),
  getById: (id) => api.get(`/sales-pitches/${id}`),
  create: (data) => api.post('/sales-pitches/', data),
  update: (id, data) => api.put(`/sales-pitches/${id}`, data),
  delete: (id) => api.delete(`/sales-pitches/${id}`),
};

export const leadScoreService = {
  getAll: (skip = 0, limit = 100) => api.get(`/lead-scores/?skip=${skip}&limit=${limit}`),
  getById: (id) => api.get(`/lead-scores/${id}`),
  create: (data) => api.post('/lead-scores/', data),
  update: (id, data) => api.put(`/lead-scores/${id}`, data),
  delete: (id) => api.delete(`/lead-scores/${id}`),
};

export const marketAnalysisService = {
  getAll: (skip = 0, limit = 100) => api.get(`/market-analyses/?skip=${skip}&limit=${limit}`),
  getById: (id) => api.get(`/market-analyses/${id}`),
  create: (data) => api.post('/market-analyses/', data),
  delete: (id) => api.delete(`/market-analyses/${id}`),
};

export const businessInsightService = {
  getAll: (skip = 0, limit = 100) => api.get(`/business-insights/?skip=${skip}&limit=${limit}`),
  getById: (id) => api.get(`/business-insights/${id}`),
  create: (data) => api.post('/business-insights/', data),
  delete: (id) => api.delete(`/business-insights/${id}`),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
