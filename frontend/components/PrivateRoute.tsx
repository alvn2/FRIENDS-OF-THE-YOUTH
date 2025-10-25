import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactElement;
  role?: 'ADMIN' | 'USER';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while auth state is being verified
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  // Determine authentication status
  const isAuthenticated = !!user;

  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Enforce role-based access if a role prop is specified
  if (role && user.role !== role) {
    // Example: Non-admins trying to access admin routes
    return <Navigate to="/dashboard" replace />;
  }

  // Authorized — render the protected content
  return children;
};

export default PrivateRoute;
