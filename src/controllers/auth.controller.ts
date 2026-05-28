import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middlewares/auth.middleware';
import {
  RegisterPayload,
  LoginPayload,
  RefreshTokenPayload,
  ChangePasswordPayload,
} from '../types/auth.types';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const payload: RegisterPayload = req.body;
      const result = await authService.register(payload);

      sendSuccess(res, result, 'Registrasi berhasil', 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registrasi gagal';
      const statusCode = message.includes('sudah') ? 409 : 400;
      sendError(res, message, statusCode);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const payload: LoginPayload = req.body;
      const result = await authService.login(payload);

      sendSuccess(res, result, 'Login berhasil');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login gagal';
      sendError(res, message, 401);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthRequest).user.userId;
      await authService.logout(userId);

      sendSuccess(res, null, 'Logout berhasil');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Logout gagal';
      sendError(res, message, 500);
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken }: RefreshTokenPayload = req.body;
      const result = await authService.refreshToken(refreshToken);

      sendSuccess(res, result, 'Token berhasil diperbarui');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal memperbarui token';
      sendError(res, message, 401);
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthRequest).user.userId;
      const user = await authService.getProfile(userId);

      sendSuccess(res, user, 'Profil berhasil diambil');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal mengambil profil';
      sendError(res, message, 404);
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthRequest).user.userId;
      const { currentPassword, newPassword }: ChangePasswordPayload = req.body;

      await authService.changePassword(userId, currentPassword, newPassword);

      sendSuccess(res, null, 'Password berhasil diubah');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal mengubah password';
      const statusCode = message.includes('tidak benar') ? 400 : 500;
      sendError(res, message, statusCode);
    }
  }
}

export const authController = new AuthController();
