import { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Maintain persistence and fetch fresh user data on reload
  const checkAuth = async () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));

      try {
        // Hit the backend /auth/me to verify token is still valid
        const { data } = await api.get('/auth/me');
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch (error) {
        // If it fails (e.g. 401), the Axios interceptor handles the cleanup
        setUser(null);
        setToken(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
      return false;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/signup', { name, email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.info('Logged out safely');
  };

  const updateProfile = async (name, email, password) => {
    try {
      const { data } = await api.put('/auth/profile', { name, email, password });
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
      }
      toast.success('Profile updated successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
      return false;
    }
  };

  const deleteAccount = async () => {
    try {
      await api.delete('/auth/profile');
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      toast.success('Account deleted permanently');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, checkAuth, updateProfile, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};
