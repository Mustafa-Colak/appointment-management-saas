import React, { createContext, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, register, logout, forgotPassword, resetPassword } from "../store/slices/authSlice";

// Context oluştur
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector(state => state.auth);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Kullanıcı girişi
  const handleLogin = useCallback(async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await dispatch(login({ email, password })).unwrap();
    } catch (error) {
      setAuthError(error.message || "Giriş başarısız");
    } finally {
      setAuthLoading(false);
    }
  }, [dispatch]);

  // Kullanıcı kaydı
  const handleRegister = useCallback(async (userData) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await dispatch(register(userData)).unwrap();
    } catch (error) {
      setAuthError(error.message || "Kayıt başarısız");
    } finally {
      setAuthLoading(false);
    }
  }, [dispatch]);

  // Çıkış yap
  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  // Şifre sıfırlama isteği
  const handleForgotPassword = useCallback(async (email) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await dispatch(forgotPassword({ email })).unwrap();
      return true;
    } catch (error) {
      setAuthError(error.message || "Şifre sıfırlama isteği başarısız");
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, [dispatch]);

  // Şifre sıfırlama
  const handleResetPassword = useCallback(async (token, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await dispatch(resetPassword({ token, password })).unwrap();
      return true;
    } catch (error) {
      setAuthError(error.message || "Şifre sıfırlama başarısız");
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, [dispatch]);

  // Redux store'dan hataları yakala
  useEffect(() => {
    if (error) {
      setAuthError(error);
    }
  }, [error]);

  // Context değerleri
  const authContextValue = {
    user,
    token,
    isAuthenticated,
    loading: loading || authLoading,
    error: authError,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
    clearError: () => setAuthError(null)
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};