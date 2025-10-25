import React, { useEffect } from 'react';
// Import useNavigate and useLocation from react-router-dom
import { useNavigate, useLocation } from 'react-router-dom';
// --- FIX: Added .tsx extension to the import path ---
import { useNotification } from '../context/NotificationContext.tsx'; 
// ---------------------------------------------------

const GoogleAuthCallbackPage: React.FC = () => {
  const navigate = useNavigate(); // Use the hook
  const location = useLocation(); // Use the hook to get location
  const { addNotification } = useNotification();

  useEffect(() => {
    // Use URLSearchParams directly on location.search
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error'); // Check if the backend sent an error

    if (error) {
      addNotification(`Google login failed: ${error}`, 'error');
      navigate('/login');
    } else if (token) {
      console.log("Token received via Google, saving:", token); // Add logging
      // Save token with the correct key
      localStorage.setItem('token', token); 
      
      // Use navigate instead of window.location
      navigate('/dashboard', { replace: true }); 

    } else {
      addNotification('Google authentication failed. No token or error received.', 'error');
      navigate('/login');
    }
    // Add location to dependency array as we read from it
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

