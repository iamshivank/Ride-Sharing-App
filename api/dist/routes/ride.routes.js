"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ride_controller_1 = require("../controllers/ride.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
/**
 * @route   POST /api/rides/request
 * @desc    Request a new ride
 * @access  Private (Rider only)
 */
router.post('/request', auth_middleware_1.authMiddleware, ride_controller_1.requestRide);
/**
 * @route   PUT /api/rides/:id/accept
 * @desc    Accept a ride request
 * @access  Private (Driver only)
 */
router.put('/:id/accept', auth_middleware_1.authMiddleware, ride_controller_1.acceptRide);
/**
 * @route   GET /api/rides/:id
 * @desc    Get ride by ID
 * @access  Private
 */
router.get('/:id', auth_middleware_1.authMiddleware, ride_controller_1.getRideById);
/**
 * @route   GET /api/rides/user
 * @desc    Get user's rides (history)
 * @access  Private
 */
router.get('/user/history', auth_middleware_1.authMiddleware, ride_controller_1.getUserRides);
/**
 * @route   PUT /api/rides/:id/cancel
 * @desc    Cancel a ride
 * @access  Private
 */
router.put('/:id/cancel', auth_middleware_1.authMiddleware, ride_controller_1.cancelRide);
/**
 * @route   PUT /api/rides/:id/complete
 * @desc    Complete a ride
 * @access  Private (Driver only)
 */
router.put('/:id/complete', auth_middleware_1.authMiddleware, ride_controller_1.completeRide);
/**
 * @route   POST /api/rides/:id/rate
 * @desc    Rate a completed ride
 * @access  Private
 */
router.post('/:id/rate', auth_middleware_1.authMiddleware, ride_controller_1.rateRide);
/**
 * @route   GET /api/rides/available
 * @desc    Get available ride requests
 * @access  Private (Driver only)
 */
router.get('/available/requests', auth_middleware_1.authMiddleware, ride_controller_1.getAvailableRides);
/**
 * @route   PUT /api/rides/:id/location
 * @desc    Update ride location (driver)
 * @access  Private (Driver only)
 */
router.put('/:id/location', auth_middleware_1.authMiddleware, ride_controller_1.updateRideLocation);
exports.default = router;
