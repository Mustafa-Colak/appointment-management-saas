const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const { validate } = require('../../middlewares/validation');
const authValidator = require('../../validators/auth');
const { protect } = require('../../middlewares/auth');

/**
 * @route POST /api/v1/auth/register
 * @desc Register new user
 * @access Public
 */
router.post('/register', authValidator.register, validate, authController.register);

/**
 * @route POST /api/v1/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', authValidator.login, validate, authController.login);

/**
 * @route GET /api/v1/auth/me
 * @desc Get current user
 * @access Private
 */
router.get('/me', protect, authController.getMe);

/**
 * @route POST /api/v1/auth/forgot-password
 * @desc Request password reset
 * @access Public
 */
router.post('/forgot-password', authValidator.forgotPassword, validate, authController.forgotPassword);

/**
 * @route POST /api/v1/auth/reset-password/:token
 * @desc Reset password with token
 * @access Public
 */
router.post('/reset-password/:token', authValidator.resetPassword, validate, authController.resetPassword);

/**
 * @route POST /api/v1/auth/update-password
 * @desc Update password
 * @access Private
 */
router.post('/update-password', protect, authValidator.updatePassword, validate, authController.updatePassword);

/**
 * @route PUT /api/v1/auth/update-profile
 * @desc Update user profile
 * @access Private
 */
router.put('/update-profile', protect, authValidator.updateProfile, validate, authController.updateProfile);

/**
 * @route POST /api/v1/auth/refresh-token
 * @desc Refresh access token
 * @access Public
 */
router.post('/refresh-token', authController.refreshToken);

/**
 * @route POST /api/v1/auth/logout
 * @desc Logout user / Clear cookie
 * @access Private
 */
router.post('/logout', protect, authController.logout);

module.exports = router;