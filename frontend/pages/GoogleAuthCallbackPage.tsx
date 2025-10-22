import React, { useEffect } from 'react';
// Fix: Use namespace import for 'react-router-dom' to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

const GoogleAuthCallbackPage: React.FC = () => {
  // Fix: Replaced useHistory with useNavigate for react-router-dom v6.
  const navigate = ReactRouterDOM.useNavigate();
  const location = ReactRouterDOM.useLocation();
  const { addNotification } = useNotification();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (error) {
      addNotification(`Google login failed: ${error}`, 'error');
      // Fix: Used navigate instead of history.push.
      navigate('/login');
    } else if (token) {
      localStorage.setItem('token', token);
      // Reloading the window will make AuthProvider pick up the new token
      // and redirect to the dashboard. Using window.location.href to ensure
      // a full state refresh after login.
      window.location.href = '#/dashboard';
    } else {
      addNotification('Google authentication failed. No token received.', 'error');
      // Fix: Used navigate instead of history.push.
      navigate('/login');
    }
  }, [location, navigate, addNotification]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brand-red mx-auto"></div>
        <p className="mt-4 text-lg">Finalizing your login...</p>
      </div>
    </div>
  );
};

export default GoogleAuthCallbackPage;