export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  username: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface AuthResponse {
  user: SafeUser;
  tokens: AuthTokens;
}

export type UserRole = 'player' | 'organizer' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  refresh_token: string | null;
  created_at: Date;
  updated_at: Date;
}

// User tanpa field sensitif
export type SafeUser = Omit<User, 'password_hash' | 'refresh_token'>;
