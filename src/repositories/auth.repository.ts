import { pool } from '../config/database';
import { User, RegisterPayload, UserRole } from '../types/auth.types';

export class AuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query<User>(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );
    return result.rows[0] || null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const result = await pool.query<User>(
      'SELECT * FROM users WHERE username = $1 AND is_active = true',
      [username]
    );
    return result.rows[0] || null;
  }

  async findById(id: string): Promise<User | null> {
    const result = await pool.query<User>(
      'SELECT * FROM users WHERE id = $1 AND is_active = true',
      [id]
    );
    return result.rows[0] || null;
  }

  async create(
    payload: RegisterPayload,
    passwordHash: string,
    role: UserRole = 'player'
  ): Promise<User> {
    const result = await pool.query<User>(
      `INSERT INTO users (username, email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [payload.username, payload.email, passwordHash, payload.fullName || null, role]
    );
    return result.rows[0];
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    await pool.query(
      'UPDATE users SET refresh_token = $1, updated_at = NOW() WHERE id = $2',
      [refreshToken, userId]
    );
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await pool.query(
      'UPDATE users SET password_hash = $1, refresh_token = NULL, updated_at = NOW() WHERE id = $2',
      [passwordHash, userId]
    );
  }

  async findByRefreshToken(refreshToken: string): Promise<User | null> {
    const result = await pool.query<User>(
      'SELECT * FROM users WHERE refresh_token = $1 AND is_active = true',
      [refreshToken]
    );
    return result.rows[0] || null;
  }

  async verifyEmail(userId: string): Promise<void> {
    await pool.query(
      'UPDATE users SET is_verified = true, updated_at = NOW() WHERE id = $1',
      [userId]
    );
  }
}

export const authRepository = new AuthRepository();
