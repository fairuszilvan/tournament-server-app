import { authRepository } from '../repositories/auth.repository';
import { hashPassword, comparePassword } from '../utils/password';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import {
  RegisterPayload,
  LoginPayload,
  AuthResponse,
  SafeUser,
  User,
  JwtPayload,
} from '../types/auth.types';

class AuthService {
  private toSafeUser(user: User): SafeUser {
    const { password_hash, refresh_token, ...safeUser } = user;
    return safeUser;
  }

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    // Cek apakah email sudah terdaftar
    const existingEmail = await authRepository.findByEmail(payload.email);
    if (existingEmail) {
      throw new Error('Email sudah terdaftar');
    }

    // Cek apakah username sudah dipakai
    const existingUsername = await authRepository.findByUsername(payload.username);
    if (existingUsername) {
      throw new Error('Username sudah digunakan');
    }

    // Hash password
    const passwordHash = await hashPassword(payload.password);

    // Buat user baru
    const user = await authRepository.create(payload, passwordHash);

    // Generate tokens
    const jwtPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    const tokens = generateTokens(jwtPayload);

    // Simpan refresh token ke database
    await authRepository.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.toSafeUser(user),
      tokens,
    };
  }

  async login(payload: LoginPayload): Promise<AuthResponse> {
    // Cari user berdasarkan email
    const user = await authRepository.findByEmail(payload.email);
    if (!user) {
      throw new Error('Email atau password salah');
    }

    // Verifikasi password
    const isPasswordValid = await comparePassword(payload.password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Email atau password salah');
    }

    // Generate tokens
    const jwtPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    const tokens = generateTokens(jwtPayload);

    // Update refresh token di database
    await authRepository.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.toSafeUser(user),
      tokens,
    };
  }

  async logout(userId: string): Promise<void> {
    // Hapus refresh token dari database
    await authRepository.updateRefreshToken(userId, null);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    // Verifikasi refresh token
    let decoded: JwtPayload;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw new Error('Refresh token tidak valid atau sudah kadaluarsa');
    }

    // Cek apakah refresh token ada di database
    const user = await authRepository.findByRefreshToken(refreshToken);
    if (!user) {
      throw new Error('Refresh token tidak ditemukan');
    }

    // Generate tokens baru
    const jwtPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    const tokens = generateTokens(jwtPayload);

    // Update refresh token di database
    await authRepository.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.toSafeUser(user),
      tokens,
    };
  }

  async getProfile(userId: string): Promise<SafeUser> {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new Error('User tidak ditemukan');
    }
    return this.toSafeUser(user);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    // Verifikasi password lama
    const isPasswordValid = await comparePassword(currentPassword, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Password saat ini tidak benar');
    }

    // Hash password baru
    const newPasswordHash = await hashPassword(newPassword);

    // Update password (juga menghapus refresh token untuk keamanan)
    await authRepository.updatePassword(userId, newPasswordHash);
  }
}

export const authService = new AuthService();
