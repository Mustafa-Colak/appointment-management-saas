import axios from "axios";

// API URL'sini ortam değişkenlerinden al
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

// Axios instance oluştur
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Auth token ekleme
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Hata yönetimi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized hatası - token geçersiz veya süresi dolmuş
    if (error.response && error.response.status === 401) {
      // Token geçersiz, kullanıcıyı çıkış yaptır
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Login sayfasına yönlendir (eğer zaten login sayfasında değilse)
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Hata mesajını standartlaştır
    const message = 
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.message || 
      "Bir hata oluştu";
    
    // Hatayı yeniden fırlat
    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

// GET isteği
api.get = async (url, params = {}, config = {}) => {
  try {
    const response = await axios.get(`${API_URL}${url}`, {
      ...config,
      params
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// POST isteği
api.post = async (url, data = {}, config = {}) => {
  try {
    const response = await axios.post(`${API_URL}${url}`, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// PUT isteği
api.put = async (url, data = {}, config = {}) => {
  try {
    const response = await axios.put(`${API_URL}${url}`, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// PATCH isteği
api.patch = async (url, data = {}, config = {}) => {
  try {
    const response = await axios.patch(`${API_URL}${url}`, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// DELETE isteği
api.delete = async (url, config = {}) => {
  try {
    const response = await axios.delete(`${API_URL}${url}`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;