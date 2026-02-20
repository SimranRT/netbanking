/**
 * API Utility
 * Handles all API calls to the backend
 */
import axios from 'axios';

// Use Render backend when deployed; localhost when developing
const API_BASE_URL = import.meta.env.VITE_API_URL
  || (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://netbanking.onrender.com/api');

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};

// User API calls
export const userAPI = {
  getBalance: async () => {
    const response = await api.get('/user/balance');
    return response.data;
  }
};

export default api;
