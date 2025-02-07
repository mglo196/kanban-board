import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.status(401).json({ message: 'Invalid username or password' });
      return; // Stop execution after response is sent
    }

    // Validate password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid username or password' });
      return; // Stop execution after response is sent
    }

    const secretKey = process.env.JWT_SECRET_KEY || '';

    // Generate JWT token with an expiration time
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

    // Return the JWT token
    res.json({ token });
  } catch (error) {
    next(error); // Pass error to the next middleware (error handler)
  }
};

const router = Router();

router.post('/login', login);

export default router;

