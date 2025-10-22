import React from 'react';
// Fix: Use namespace import for 'react-router-dom' to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactElement;
  role?: 'admin';
}

// Fix: Rewrote component to be a v6-style PrivateRoute.
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = ReactRouterDOM.useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they login.
    return <ReactRouterDOM.Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role === 'admin' && user?.role !== 'admin') {
    // If the user is not an admin, redirect them to the dashboard.
    return <ReactRouterDOM.Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;