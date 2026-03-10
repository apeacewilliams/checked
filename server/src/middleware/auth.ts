import type { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase.js';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

declare global {
  namespace Express {
    interface Request {
      authUser: AuthUser | null;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    req.authUser = null;

    return next();
  }

  try {
    const token = header.slice('Bearer '.length);
    const decoded = await auth.verifyIdToken(token);

    req.authUser = {
      uid: decoded.uid,
      email: decoded.email ?? null,
      displayName: decoded.name ?? null,
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    req.authUser = null;
  }

  return next();
};
