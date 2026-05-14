import axios from 'axios';

const api = axios.create({
  // Pointing to your existing backend server or env variable
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Automatically attach JWT token to every request
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

// Response interceptor: Handle unauthorized/expired tokens globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear corrupt/expired tokens
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Force redirect to login if they are on a protected page
      const publicPaths = ['/', '/login', '/signup'];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
