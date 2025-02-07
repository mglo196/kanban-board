import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
}

// Extend the Express Request interface to include the 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  // Get the token from the authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    // Return the response for a missing token, but don't return anything else after
    res.status(403).json({ message: 'Access denied. No token provided.' });
    return; // Don't continue to next middleware
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || '') as JwtPayload;

    // Attach the user data to the request object
    req.user = decoded;

    // Pass control to the next middleware
    next();
  } catch (error) {
    // Return the response for an invalid token, and stop execution here
    res.status(401).json({ message: 'Invalid token.' });
    return; // Don't continue to next middleware
  }
};
