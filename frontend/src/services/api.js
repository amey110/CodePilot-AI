import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 25000, // 25s timeout allows for Render cold-starts but prevents infinite hangs
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

// Response Interceptor: Handle global errors with clean human-readable messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginEndpoint = error.config?.url?.includes('/auth/login');

    if (error.response && error.response.status === 401 && !isLoginEndpoint) {
      // Clear token and redirect to login if session expires on an authenticated route
      localStorage.removeItem('token');
      // Dispatch a custom event to notify AuthContext
      window.dispatchEvent(new Event('auth-expired'));
    }
    
    // Normalize error message for easier consumption in components
    let message = 'An unexpected error occurred.';

    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      if (Array.isArray(detail)) {
        // FastAPI / Pydantic validation error array
        message = detail.map((d) => d.msg || JSON.stringify(d)).join(', ');
      } else if (typeof detail === 'string') {
        message = detail;
      } else {
        message = JSON.stringify(detail);
      }
    } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      message = 'Server request timed out. The server might be waking up or unreachable. Please try again.';
    } else if (!error.response) {
      message = `Unable to connect to backend server at ${API_URL}. Please verify the backend is running.`;
    } else if (error.response?.status === 500) {
      message = 'Internal server error. Please check server logs.';
    }

    const normalizedError = new Error(message);
    normalizedError.status = error.response?.status;
    normalizedError.originalError = error;
    
    return Promise.reject(normalizedError);
  }
);

export default api;
