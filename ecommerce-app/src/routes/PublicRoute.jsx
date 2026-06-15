import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader/Loader';

/**
 * Route guard restricting access to non-authenticated users only (e.g. Login, Sign Up).
 */
export function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader type="fullscreen" />;
  }

  if (isAuthenticated) {
    // Redirect logged-in user to profile or homepage
    const redirectPath = location.state?.from?.pathname || '/profile';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

export default PublicRoute;
