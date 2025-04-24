"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', auth_middleware_1.authMiddleware, user_controller_1.getProfile);
/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', auth_middleware_1.authMiddleware, user_controller_1.updateProfile);
/**
 * @route   DELETE /api/users/profile
 * @desc    Delete user profile
 * @access  Private
 */
router.delete('/profile', auth_middleware_1.authMiddleware, user_controller_1.deleteProfile);
/**
 * @route   PUT /api/users/location
 * @desc    Update user location
 * @access  Private
 */
router.put('/location', auth_middleware_1.authMiddleware, user_controller_1.updateLocation);
/**
 * @route   PUT /api/users/driver-mode
 * @desc    Toggle driver mode
 * @access  Private (Driver only)
 */
router.put('/driver-mode', auth_middleware_1.authMiddleware, user_controller_1.setDriverMode);
exports.default = router;
