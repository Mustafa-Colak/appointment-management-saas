const jwt = require('jsonwebtoken');
const { AppError } = require('../errors/AppError');

class TokenService {
  // JWT token üret
  generateToken(payload, expiresIn = '30d') {
    try {
      return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn }
      );
    } catch (error) {
      throw new AppError('Token oluşturma hatası', 500);
    }
  }

  // JWT token doğrula
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new AppError('Geçersiz token', 401);
      }
      if (error.name === 'TokenExpiredError') {
        throw new AppError('Token süresi doldu', 401);
      }
      throw new AppError('Token doğrulama hatası', 500);
    }
  }

  // Refresh token oluştur
  generateRefreshToken(userId) {
    try {
      return jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
    } catch (error) {
      throw new AppError('Refresh token oluşturma hatası', 500);
    }
  }

  // Refresh token ile yeni access token oluştur
  refreshAccessToken(refreshToken) {
    try {
      // Refresh token'ı doğrula
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
      );

      // Kullanıcı ID'sini al
      const userId = decoded.id;

      // Yeni access token oluştur
      return this.generateToken({ id: userId });
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new AppError('Geçersiz refresh token', 401);
      }
      if (error.name === 'TokenExpiredError') {
        throw new AppError('Refresh token süresi doldu', 401);
      }
      throw new AppError('Token yenileme hatası', 500);
    }
  }

  // Tek kullanımlık token oluştur (şifre sıfırlama vb. için)
  generateOneTimeToken(payload, expiresIn = '1h') {
    try {
      return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn }
      );
    } catch (error) {
      throw new AppError('Tek kullanımlık token oluşturma hatası', 500);
    }
  }

  // Token bilgilerini döndür (decode)
  decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      throw new AppError('Token çözümleme hatası', 500);
    }
  }
}

module.exports = new TokenService();