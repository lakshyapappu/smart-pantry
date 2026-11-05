import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token if stored locally
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smart_pantry_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthorized redirects gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired
      if (localStorage.getItem('smart_pantry_token')) {
        localStorage.removeItem('smart_pantry_token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;

