import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RoleBasedRoute = () => {
  const { isAuthenticated, roles } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userHasRequiredRole = roles.some(role => ['Manager', 'Boss', 'Finance Officer'].includes(role));

  if (userHasRequiredRole) {
    return <Navigate to="/dashboard" />;
  }else{
    return <Navigate to="/minerals/tantalum" />
  }
};

export default RoleBasedRoute;
