// Global error handler middleware
const { AppError } = require("../errors/AppError");

exports.errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // AppError sınıfından bir hata ise
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      errors: err.errors
    });
  }

  // MongoDB hataları
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: "Validasyon Hatası",
      errors
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: "Bu kayıt zaten mevcut",
      field: Object.keys(err.keyValue)[0]
    });
  }

  // JWT hataları
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Geçersiz token"
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Token süresi doldu"
    });
  }

  // Diğer tüm hatalar için
  return res.status(500).json({
    success: false,
    error: "Sunucu Hatası",
    message: process.env.NODE_ENV === "development" ? err.message : "Beklenmedik bir hata oluştu"
  });
};