import express from 'express';
import { 
  requestRide,
  acceptRide,
  getRideById,
  getUserRides,
  cancelRide,
  completeRide,
  rateRide,
  getAvailableRides,
  updateRideLocation
} from '../controllers/ride.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

/**
 * @route   POST /api/rides/request
 * @desc    Request a new ride
 * @access  Private (Rider only)
 */
router.post('/request', authMiddleware, requestRide);

/**
 * @route   PUT /api/rides/:id/accept
 * @desc    Accept a ride request
 * @access  Private (Driver only)
 */
router.put('/:id/accept', authMiddleware, acceptRide);

/**
 * @route   GET /api/rides/:id
 * @desc    Get ride by ID
 * @access  Private
 */
router.get('/:id', authMiddleware, getRideById);

/**
 * @route   GET /api/rides/user
 * @desc    Get user's rides (history)
 * @access  Private
 */
router.get('/user/history', authMiddleware, getUserRides);

/**
 * @route   PUT /api/rides/:id/cancel
 * @desc    Cancel a ride
 * @access  Private
 */
router.put('/:id/cancel', authMiddleware, cancelRide);

/**
 * @route   PUT /api/rides/:id/complete
 * @desc    Complete a ride
 * @access  Private (Driver only)
 */
router.put('/:id/complete', authMiddleware, completeRide);

/**
 * @route   POST /api/rides/:id/rate
 * @desc    Rate a completed ride
 * @access  Private
 */
router.post('/:id/rate', authMiddleware, rateRide);

/**
 * @route   GET /api/rides/available
 * @desc    Get available ride requests
 * @access  Private (Driver only)
 */
router.get('/available/requests', authMiddleware, getAvailableRides);

/**
 * @route   PUT /api/rides/:id/location
 * @desc    Update ride location (driver)
 * @access  Private (Driver only)
 */
router.put('/:id/location', authMiddleware, updateRideLocation);

export default router; 