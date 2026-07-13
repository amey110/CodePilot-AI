import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if session expires
      localStorage.removeItem('token');
      // Dispatch a custom event to notify AuthContext
      window.dispatchEvent(new Event('auth-expired'));
    }
    
    // Normalize error message for easier consumption in components
    const message = error.response?.data?.detail || 'An unexpected error occurred.';
    const normalizedError = new Error(message);
    normalizedError.status = error.response?.status;
    normalizedError.originalError = error;
    
    return Promise.reject(normalizedError);
  }
);

export default api;
