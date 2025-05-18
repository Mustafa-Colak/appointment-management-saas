const User = require("../models/User");
const { AppError } = require("../errors/AppError");
const TokenService = require("../services/tokenService");
const EmailService = require("../services/emailService");
const crypto = require("crypto");

// Kullanıcı Kaydı
exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role, tenantId } = req.body;

    // E-posta kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("Bu e-posta adresi zaten kullanılıyor", 400));
    }

    // Yeni kullanıcı oluştur
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || "staff",
      tenantId
    });

    // JWT token oluştur
    const token = user.generateAuthToken();

    // Parolayı gizle
    user.password = undefined;

    res.status(201).json({
      success: true,
      token,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Kullanıcı Girişi
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Email ve password kontrolü
    if (!email || !password) {
      return next(new AppError("Lütfen e-posta ve şifre giriniz", 400));
    }

    // Kullanıcıyı e-posta ile bul ve şifreyi de getir
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new AppError("Geçersiz e-posta veya şifre", 401));
    }

    // Şifre kontrolü
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return next(new AppError("Geçersiz e-posta veya şifre", 401));
    }

    // Hesap durumu kontrolü
    if (user.status !== "active") {
      return next(new AppError("Hesabınız aktif değil. Lütfen yöneticinizle iletişime geçin", 403));
    }

    // Son giriş tarihini güncelle
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // JWT token oluştur
    const token = user.generateAuthToken();

    // Parolayı gizle
    user.password = undefined;

    res.status(200).json({
      success: true,
      token,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Mevcut kullanıcı bilgisini getir
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new AppError("Kullanıcı bulunamadı", 404));
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Şifre sıfırlama talebi
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new AppError("Lütfen e-posta adresinizi giriniz", 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError("Bu e-posta adresine sahip bir kullanıcı bulunamadı", 404));
    }

    // Şifre sıfırlama token'ı oluştur
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    
    // 10 dakika geçerlilik süresi
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // Şifre sıfırlama e-postası gönder
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/reset-password/${resetToken}`;

    try {
      await EmailService.sendPasswordResetEmail(user.email, resetUrl);

      res.status(200).json({
        success: true,
        message: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi"
      });
    } catch (emailError) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new AppError("E-posta gönderimi sırasında bir hata oluştu", 500));
    }
  } catch (error) {
    next(error);
  }
};

// Şifre sıfırlama
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token