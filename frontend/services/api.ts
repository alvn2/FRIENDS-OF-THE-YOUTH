import axios from 'axios';

// The base URL should point to your backend server via the proxy
// '/api' will be proxied to 'http://localhost:5000/api/v1' by the corrected vite.config.ts
const API_URL = '/api'; 

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
      // --- Use standard Bearer token ---
      config.headers['Authorization'] = `Bearer ${token}`; 
      // ---------------------------------
    }
     // Clean up old header if present
    delete config.headers['x-auth-token'];
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (keep as is, looks correct)
apiClient.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.error("Authentication Error (401): Logging out.");
        localStorage.removeItem('token'); 
        if (window.location.hash !== '#/login') {
            window.location.href = '#/login'; 
        }
      }
    } else if (error.request) {
      console.error("Network Error: Could not reach backend.", error.message);
    } else {
      console.error('Axios Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;

