import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Ensure correct path

interface PrivateRouteProps {
  children: React.ReactElement;
  role?: 'ADMIN' | 'USER'; // Use specific roles
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  console.log(`[DEBUG] PrivateRoute (${location.pathname}): isLoading=${isLoading}, user=${user ? user.email : null}`); // Log state

  // Show loading spinner while auth state is being verified
  if (isLoading) {
    console.log(`[DEBUG] PrivateRoute (${location.pathname}): Showing loading spinner.`); // Log loading
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  // Determine authentication status AFTER loading is false
  const isAuthenticated = !!user;

  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    // --- ADD LOG BEFORE REDIRECT ---
    console.log(`[DEBUG] PrivateRoute (${location.pathname}): Not authenticated. Redirecting to /login.`); 
    // -------------------------------
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Enforce role-based access if a role prop is specified
  if (role && user.role !== role) {
     // --- ADD LOG BEFORE REDIRECT ---
    console.log(`[DEBUG] PrivateRoute (${location.pathname}): Role mismatch (User: ${user.role}, Required: ${role}). Redirecting to /dashboard.`);
     // -------------------------------
    return <Navigate to="/dashboard" replace />; // Redirect non-admins from admin routes
  }

  // Authorized — render the protected content
  console.log(`[DEBUG] PrivateRoute (${location.pathname}): Authorized. Rendering children.`); // Log success
  return children;
};

export default PrivateRoute;
