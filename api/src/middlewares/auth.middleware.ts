import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';

// Extend the Request type to include user data
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error: AppError = new Error('No token provided, authorization denied');
    error.statusCode = 401;
    return next(error);
  }

  try {
    // Verify token
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    
    // Set user data in request
    req.user = decoded;
    next();
  } catch (err) {
    const error: AppError = new Error('Token is not valid');
    error.statusCode = 401;
    next(error);
  }
}; 