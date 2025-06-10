import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

interface RoleBasedRouteProps {
  allowedRoles: string[];
  children?: React.ReactNode;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles, children }) => {
  const { isAuthenticated, roles } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userHasRequiredRole = roles.some(role => allowedRoles.includes(role));

  if (!userHasRequiredRole) {
    // You can redirect to an "Unauthorized" page or back to dashboard
    // For simplicity, showing a message or redirecting to dashboard
    console.warn(`User with roles [${roles.join(', ')}] tried to access a route requiring [${allowedRoles.join(', ')}]`);
    // return <Navigate to="/dashboard" replace />;
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Unauthorized</h1>
        <p className="text-gray-600 dark:text-gray-300">You do not have permission to view this page.</p>
        {/* Optionally add a button to go back or to dashboard */}
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
};

export default RoleBasedRoute;
