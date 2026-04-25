import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Prevent redirect on hard refresh while we hydrate user from localStorage.
  if (loading) {
    return null;
  }

  if (!user || !user.is_admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
