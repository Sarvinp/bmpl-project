import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { User } from '../models/User';

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Authentication required. Please provide a valid token.',
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const decoded = verifyToken(token);
      
      // Optionally verify user still exists
      const user = await User.findById(decoded.userId);
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'User not found. Token is invalid.',
        });
        return;
      }

      req.user = {
        userId: decoded.userId,
        email: decoded.email,
      };

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token.',
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Authentication error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    return;
  }
};

