import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAuthInfo, type UserRole } from '../store/auth';

interface ProtectedRouteProps {
  children: React.ReactElement;
  role?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const auth = getAuthInfo();
  const location = useLocation();

  if (!auth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && auth.role !== role) {
    // If user is logged in but role mismatch, redirect to appropriate home
    return <Navigate to={auth.role === 'ADMIN' ? '/dashboard' : '/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;
