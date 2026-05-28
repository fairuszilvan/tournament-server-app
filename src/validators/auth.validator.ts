import { body } from 'express-validator';

export const registerValidator = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username wajib diisi')
    .isLength({ min: 3, max: 30 }).withMessage('Username harus antara 3-30 karakter')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username hanya boleh mengandung huruf, angka, dan underscore'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email wajib diisi')
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password wajib diisi')
    .isLength({ min: 8 }).withMessage('Password minimal 8 karakter')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage(
      'Password harus mengandung minimal 1 huruf kecil, 1 huruf besar, dan 1 angka'
    ),

  body('fullName')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Nama lengkap maksimal 100 karakter'),
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email wajib diisi')
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password wajib diisi'),
];

export const refreshTokenValidator = [
  body('refreshToken')
    .notEmpty().withMessage('Refresh token wajib diisi'),
];

export const changePasswordValidator = [
  body('currentPassword')
    .notEmpty().withMessage('Password saat ini wajib diisi'),

  body('newPassword')
    .notEmpty().withMessage('Password baru wajib diisi')
    .isLength({ min: 8 }).withMessage('Password baru minimal 8 karakter')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage(
      'Password baru harus mengandung minimal 1 huruf kecil, 1 huruf besar, dan 1 angka'
    )
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('Password baru tidak boleh sama dengan password lama');
      }
      return true;
    }),
];
