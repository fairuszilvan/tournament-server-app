import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { sendError } from '../utils/response';
import { UserRole, JwtPayload } from '../types/auth.types';

export interface AuthRequest extends Request {
  user: JwtPayload;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Token autentikasi diperlukan', 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    (req as AuthRequest).user = decoded;
    next();
  } catch {
    sendError(res, 'Token tidak valid atau sudah kadaluarsa', 401);
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      sendError(res, 'Tidak terautentikasi', 401);
      return;
    }

    if (!roles.includes(authReq.user.role)) {
      sendError(res, 'Tidak memiliki akses untuk melakukan aksi ini', 403);
      return;
    }

    next();
  };
};
