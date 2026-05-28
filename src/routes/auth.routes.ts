import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
  changePasswordValidator,
} from '../validators/auth.validator';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registrasi user baru
 * @access  Public
 */
router.post(
  '/register',
  registerValidator,
  validate,
  authController.register.bind(authController)
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  loginValidator,
  validate,
  authController.login.bind(authController)
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (hapus refresh token)
 * @access  Private
 */
router.post(
  '/logout',
  authenticate,
  authController.logout.bind(authController)
);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Perbarui access token menggunakan refresh token
 * @access  Public
 */
router.post(
  '/refresh-token',
  refreshTokenValidator,
  validate,
  authController.refreshToken.bind(authController)
);

/**
 * @route   GET /api/auth/profile
 * @desc    Ambil profil user yang sedang login
 * @access  Private
 */
router.get(
  '/profile',
  authenticate,
  authController.getProfile.bind(authController)
);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Ubah password user
 * @access  Private
 */
router.put(
  '/change-password',
  authenticate,
  changePasswordValidator,
  validate,
  authController.changePassword.bind(authController)
);

export default router;
