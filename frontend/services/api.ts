import axios from 'axios';

// The base URL should point to your backend server
// For development, it might be 'http://localhost:5000/api'
const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the token to every request if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// New: Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    // Check if the error is from a response
    if (error.response) {
      // Handle 401 Unauthorized: token is invalid or expired
      if (error.response.status === 401) {
        // Don't show a notification for 401, just log out.
        console.error("Authentication Error: Logging out.");
        localStorage.removeItem('token');
        // Redirect to login page. Using window.location to ensure a full refresh
        // which will clear all application state.
        if (window.location.hash !== '#/login') {
            window.location.href = '#/login';
        }
      }
    }
    // Return the error to be handled by the component's catch block
    return Promise.reject(error);
  }
);


export default api;
