const User = require('../models/User');
const { AppError } = require('../errors/AppError');
const TokenService = require('./tokenService');
const EmailService = require('./emailService');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

/**
 * Authentication Service
 * Handles business logic for authentication-related operations
 */
class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User data
   * @returns {Object} User object and token
   */
  async register(userData) {
    const { email, password, firstName, lastName, role, tenantId } = userData;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Bu e-posta adresi zaten kullanılıyor', 400);
    }

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: role || 'staff',
      tenantId
    });

    // Generate token
    const token = TokenService.generateToken({
      id: user._id,
      tenantId: user.tenantId,
      role: user.role
    });

    // Return user without password
    const userObject = user.toObject();
    delete userObject.password;

    return {
      user: userObject,
      token
    };
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Object} User object and token
   */
  async login(email, password) {
    // Validate input
    if (!email || !password) {
      throw new AppError('Lütfen e-posta ve şifre giriniz', 400);
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Geçersiz e-posta veya şifre', 401);
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Geçersiz e-posta veya şifre', 401);
    }

    // Check status
    if (user.status !== 'active') {
      throw new AppError('Hesabınız aktif değil. Lütfen yöneticinizle iletişime geçin', 403);
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // Generate token
    const token = TokenService.generateToken({
      id: user._id,
      tenantId: user.tenantId,
      role: user.role
    });

    // Return user without password
    const userObject = user.toObject();
    delete userObject.password;

    return {
      user: userObject,
      token
    };
  }

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Object} User object
   */
  async getUserById(id) {
    const user = await User.findById(id);
    
    if (!user) {
      throw new AppError('Kullanıcı bulunamadı', 404);
    }

    return user;
  }

  /**
   * Forgot password
   * @param {string} email - User email
   * @returns {boolean} Success status
   */
  async forgotPassword(email) {
    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      throw new AppError('Bu e-posta adresine sahip bir kullanıcı bulunamadı', 404);
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Token expires in 10 minutes
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // Send email with reset URL
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      await EmailService.sendPasswordResetEmail(user.email, resetUrl);
      
      return true;
    } catch (err) {
      // If email fails, reset token fields
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      
      throw new AppError('E-posta gönderilirken bir hata oluştu, lütfen daha sonra tekrar deneyin', 500);
    }
  }

  /**
   * Reset password
   * @param {string} token - Reset token
   * @param {string} password - New password
   * @returns {boolean} Success status
   */
  async resetPassword(token, password) {
    // Hash the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new AppError('Token geçersiz veya süresi dolmuş', 400);
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Generate token
    const jwtToken = TokenService.generateToken({
      id: user._id,
      tenantId: user.tenantId,
      role: user.role
    });

    return {
      success: true,
      token: jwtToken
    };
  }

  /**
   * Update password
   * @param {string} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {boolean} Success status
   */
  async updatePassword(userId, currentPassword, newPassword) {
    // Find user
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      throw new AppError('Kullanıcı bulunamadı', 404);
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      throw new AppError('Mevcut şifre yanlış', 401);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return { success: true };
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} userData - User data to update
   * @returns {Object} Updated user
   */
  async updateProfile(userId, userData) {
    // Find user
    const user = await User.findById(userId);
    
    if (!user) {
      throw new AppError('Kullanıcı bulunamadı', 404);
    }

    // Update fields
    const allowedFields = ['firstName', 'lastName', 'email', 'phone', 'avatar'];
    
    for (const field of allowedFields) {
      if (userData[field] !== undefined) {
        user[field] = userData[field];
      }
    }

    // Save user
    await user.save();

    return user;
  }

  /**
   * Refresh token
   * @param {string} refreshToken - Refresh token
   * @returns {Object} New access token
   */
  async refreshToken(refreshToken) {
    // Validate refresh token
    try {
      const decoded = TokenService.verifyRefreshToken(refreshToken);
      
      // Generate new access token
      const accessToken = TokenService.generateToken({
        id: decoded.id,
        tenantId: decoded.tenantId,
        role: decoded.role
      });

      return {
        token: accessToken
      };
    } catch (error) {
      throw new AppError('Geçersiz veya süresi dolmuş yenileme jetonu', 401);
    }
  }
}

module.exports = new AuthService();