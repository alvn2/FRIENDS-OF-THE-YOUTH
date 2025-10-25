// src/services/api.ts

import axios from 'axios';

// 1. Get the LIVE backend URL from Vercel's environment variables
//    IF in production, use the live URL.
//    IF in development, use the local proxy '/api'.
const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';

console.log("API Base URL:", API_URL); // For debugging

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the standard Authorization: Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (to handle 401 errors)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Authentication Error (401): Logging out.");
      localStorage.removeItem('token');
      // Use hash router navigation for logout
      if (window.location.hash !== '#/login') {
        window.location.hash = '#/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;