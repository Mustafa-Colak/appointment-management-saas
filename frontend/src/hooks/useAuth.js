import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook to access authentication context throughout the application
 * Provides simplified access to authentication state and methods
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    clearError
  } = context;

  return {
    // State
    user,
    token,
    isAuthenticated,
    loading,
    error,
    
    // Actions
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    clearError
  };
};