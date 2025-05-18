import api from './api';

// Kullanıcı girişi
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    
    // Token ve kullanıcı bilgilerini localStorage'a kaydet
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

// Kullanıcı kaydı
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    
    // Token ve kullanıcı bilgilerini localStorage'a kaydet
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

// Çıkış yap
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return true;
};

// Mevcut kullanıcı bilgisini getir
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Şifre sıfırlama isteği
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response;
  } catch (error) {
    throw error;
  }
};

// Şifre sıfırlama
export const resetPassword = async (token, password) => {
  try {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response;
  } catch (error) {
    throw error;
  }
};

// Şifre güncelleme
export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.post('/auth/update-password', {
      currentPassword,
      newPassword
    });
    
    return response;
  } catch (error) {
    throw error;
  }
};

// Kullanıcı profilini güncelle
export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/auth/update-profile', userData);
    
    // Kullanıcı bilgilerini localStorage'da güncelle
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

// Token kontrolü
export const checkToken = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (token && user) {
    return { token, user };
  }
  
  return null;
};

export default {
  login,
  register,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateProfile,
  checkToken
};