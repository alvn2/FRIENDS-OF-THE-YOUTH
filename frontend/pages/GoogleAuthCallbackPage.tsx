import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
// Import useAuth to manually trigger the token set
import { useAuth } from '../context/AuthContext';

const GoogleAuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addNotification } = useNotification();
  // We can't use useAuth() here to set the token, as AuthProvider is what's loading.
  // The AuthProvider itself is designed to find this token.

  useEffect(() => {
    // AuthProvider's Effect 1 is already built to look for this token
    // in the URL. All we need to do is redirect to the dashboard.
    // The AuthProvider will handle the token and log the user in.
    
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (error) {
      addNotification(`Google login failed: ${error}`, 'error');
      navigate('/login');
    } else if (token) {
      // The AuthProvider (in Effect 1) will find this token and save it.
      // We just need to navigate to the dashboard, and the AuthProvider
      // will see the token, fetch the user, and log us in.
      navigate('/dashboard', { replace: true });
    } else {
      addNotification('Google authentication failed. No token or error received.', 'error');
      navigate('/login');
    }
  }, [location, navigate, addNotification]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brand-primary mx-auto"></div>
        <p className="mt-4 text-lg">Finalizing your login...</p>
      </div>
    </div>
  );
};

export default GoogleAuthCallbackPage;