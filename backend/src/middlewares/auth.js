const jwt = require("jsonwebtoken");
const { AppError } = require("../errors/AppError");
const User = require("../models/User");

// JWT token ile kimlik doğrulama
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Token'ı header'dan al
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("Erişim için giriş yapmanız gerekiyor", 401)
      );
    }

    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Token'a ait kullanıcıyı bul
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(
        new AppError("Bu token'a ait kullanıcı artık mevcut değil", 401)
      );
    }

    // Kullanıcı hesap durumunu kontrol et
    if (user.status !== "active") {
      return next(
        new AppError("Hesabınız aktif değil. Lütfen yöneticinizle iletişime geçin", 403)
      );
    }

    // Kullanıcı bilgilerini request'e ekle
    req.user = {
      id: user._id,
      tenantId: user.tenantId,
      role: user.role,
      email: user.email
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Geçersiz token. Lütfen tekrar giriş yapın", 401));
    }

    if (error.name === "TokenExpiredError") {
      return next(new AppError("Token süresi doldu. Lütfen tekrar giriş yapın", 401));
    }

    next(error);
  }
};

// Rol bazlı erişim kontrolü
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("Bu işlemi gerçekleştirmek için yetkiniz yok", 403)
      );
    }
    next();
  };
};

// Kiracı erişim kontrolü
exports.checkTenantAccess = (req, res, next) => {
  // Tenant ID request üzerinden geliyorsa kontrol et
  if (req.params.tenantId && req.user.tenantId) {
    if (req.params.tenantId !== req.user.tenantId.toString() && req.user.role !== "admin") {
      return next(
        new AppError("Bu işletmeye erişim izniniz yok", 403)
      );
    }
  }
  next();
};