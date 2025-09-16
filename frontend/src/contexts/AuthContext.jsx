// contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import authService from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setCurrentUser(user);
        setError(null);

        if (user) {
          // Fetch user profile from backend
          const profile = await authService.getUserProfile(user.uid);
          setUserProfile(profile);
        } else {
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.loginWithEmail(email, password, rememberMe);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.registerWithEmail(userData);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.loginWithGoogle();
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    setError(null);

    try {
      const result = await authService.resetPassword(email);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.logout();
      setCurrentUser(null);
      setUserProfile(null);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    setError(null);

    try {
      const result = await authService.updateUserProfile(currentUser.uid, profileData);

      // Refresh profile data
      const updatedProfile = await authService.getUserProfile(currentUser.uid);
      setUserProfile(updatedProfile);

      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const refreshProfile = async () => {
    if (!currentUser) return;

    try {
      const profile = await authService.getUserProfile(currentUser.uid);
      setUserProfile(profile);
      return profile;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    // State
    currentUser,
    userProfile,
    loading,
    error,

    // Actions
    login,
    register,
    loginWithGoogle,
    resetPassword,
    logout,
    updateProfile,
    refreshProfile,
    clearError,

    // Computed
    isAuthenticated: !!currentUser,
    isProfileComplete: userProfile?.profileComplete || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
