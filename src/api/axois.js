import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor: Automatically attach Bearer token to protected routes
api.interceptors.request.use(
  (config) => {
    // Check for admin token first, fallback to standard user token
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle unauthenticated or server errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear tokens and redirect to login if session expires
      localStorage.removeItem('token');
      localStorage.removeItem('admin_token');
      // Optional: window.location.href = '/user/login';
    }
    return Promise.reject(error);
  }
);

export default api;