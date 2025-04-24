import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  deleteProfile,
  updateLocation,
  setDriverMode
} from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', authMiddleware, getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authMiddleware, updateProfile);

/**
 * @route   DELETE /api/users/profile
 * @desc    Delete user profile
 * @access  Private
 */
router.delete('/profile', authMiddleware, deleteProfile);

/**
 * @route   PUT /api/users/location
 * @desc    Update user location
 * @access  Private
 */
router.put('/location', authMiddleware, updateLocation);

/**
 * @route   PUT /api/users/driver-mode
 * @desc    Toggle driver mode
 * @access  Private (Driver only)
 */
router.put('/driver-mode', authMiddleware, setDriverMode);

export default router; 