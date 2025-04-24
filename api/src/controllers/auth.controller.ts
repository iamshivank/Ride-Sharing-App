import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { catchAsync } from '../middlewares/errorHandler';

// Temporary user storage (will be replaced with Prisma)
const users: any[] = [];
let refreshTokens: string[] = [];

// Generate JWT token
const generateToken = (user: any, expiresIn = '1h') => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    secret,
    { expiresIn }
  );
};

// Generate Refresh token
const generateRefreshToken = (user: any) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
  }
  
  return jwt.sign(
    { id: user.id },
    secret,
    { expiresIn: '7d' }
  );
};

// Register a new user
export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, role = 'rider' } = req.body;

  // Check if user already exists
  if (users.find(user => user.email === email)) {
    return res.status(400).json({
      success: false,
      message: 'User already exists'
    });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    role,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  users.push(newUser);

  // Generate tokens
  const accessToken = generateToken(newUser);
  const refreshToken = generateRefreshToken(newUser);
  refreshTokens.push(refreshToken);

  // Send response
  res.status(201).json({
    success: true,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    },
    accessToken,
    refreshToken
  });
});

// Login user
export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user
  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Generate tokens
  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  refreshTokens.push(refreshToken);

  // Send response
  res.status(200).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    accessToken,
    refreshToken
  });
});

// Logout user
export const logout = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  // Remove refresh token
  refreshTokens = refreshTokens.filter(token => token !== refreshToken);

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Refresh token
export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  // Check if refresh token exists
  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.status(403).json({
      success: false,
      message: 'Refresh token is invalid'
    });
  }

  try {
    // Verify refresh token
    const decoded: any = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    );

    // Find user
    const user = users.find(user => user.id === decoded.id);
    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new access token
    const accessToken = generateToken(user);

    res.status(200).json({
      success: true,
      accessToken
    });
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

// Google OAuth login/register
export const googleAuth = catchAsync(async (req: Request, res: Response) => {
  const { name, email, googleId } = req.body;

  // Find user or create if not exists
  let user = users.find(user => user.email === email);

  if (!user) {
    // Create new user
    user = {
      id: Date.now().toString(),
      name,
      email,
      googleId,
      password: 'OAUTH_USER', // Placeholder since OAuth users don't have passwords
      role: 'rider',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.push(user);
  }

  // Generate tokens
  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  refreshTokens.push(refreshToken);

  // Send response
  res.status(200).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    accessToken,
    refreshToken
  });
}); 