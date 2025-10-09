import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(user.role)) {
    alert("شما به این صفحه دسترسی ندارید.");
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;