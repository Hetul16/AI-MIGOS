// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './ui/LoadingSpinner'; // Corrected import path

const ProtectedRoute = ({ children, requireProfileComplete = false }) => {
  const { currentUser, userProfile, loading, isAuthenticated, isProfileComplete } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground font-caption">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/user-authentication" state={{ from: location }} replace />;
  }

  if (requireProfileComplete && !isProfileComplete) {
    // Redirect to onboarding if profile is not complete
    return <Navigate to="/onboarding-wizard" replace />;
  }

  return children;
};

// Higher order component version
export const withAuth = (Component, options = {}) => {
  return function AuthenticatedComponent(props) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

// Hook for conditional rendering based on auth state
export const useAuthGuard = () => {
  const { isAuthenticated, isProfileComplete, loading } = useAuth();

  return {
    isAuthenticated,
    isProfileComplete,
    loading,
    canAccess: (requireAuth = true, requireProfile = false) => {
      if (loading) return false;
      if (requireAuth && !isAuthenticated) return false;
      if (requireProfile && !isProfileComplete) return false;
      return true;
    }
  };
};

export default ProtectedRoute;
