"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDriverMode = exports.updateLocation = exports.deleteProfile = exports.updateProfile = exports.getProfile = void 0;
const errorHandler_1 = require("../middlewares/errorHandler");
// Temporary user storage (will be replaced with Prisma)
// This would be imported from a database service in a real app
const users = [];
// Get user profile
exports.getProfile = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { id } = req.user;
    // Find user
    const user = users.find(user => user.id === id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    // Send response
    res.status(200).json({
        success: true,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            location: user.location || null,
            isOnline: user.isOnline || false,
            isDriverMode: user.isDriverMode || false,
            profileImg: user.profileImg || null,
            phoneNumber: user.phoneNumber || null,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    });
});
// Update user profile
exports.updateProfile = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { id } = req.user;
    const { name, email, phoneNumber, profileImg } = req.body;
    // Find user
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    // Update user
    users[userIndex] = {
        ...users[userIndex],
        name: name || users[userIndex].name,
        email: email || users[userIndex].email,
        phoneNumber: phoneNumber || users[userIndex].phoneNumber,
        profileImg: profileImg || users[userIndex].profileImg,
        updatedAt: new Date()
    };
    // Send response
    res.status(200).json({
        success: true,
        user: {
            id: users[userIndex].id,
            name: users[userIndex].name,
            email: users[userIndex].email,
            role: users[userIndex].role,
            phoneNumber: users[userIndex].phoneNumber,
            profileImg: users[userIndex].profileImg
        }
    });
});
// Delete user profile
exports.deleteProfile = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { id } = req.user;
    // Find user
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    // Delete user
    users.splice(userIndex, 1);
    // Send response
    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    });
});
// Update user location
exports.updateLocation = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { id } = req.user;
    const { latitude, longitude } = req.body;
    // Validate input
    if (!latitude ||
        !longitude ||
        typeof latitude !== 'number' ||
        typeof longitude !== 'number') {
        return res.status(400).json({
            success: false,
            message: 'Invalid location data'
        });
    }
    // Find user
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    // Update user location
    users[userIndex].location = { latitude, longitude };
    users[userIndex].updatedAt = new Date();
    // Send response
    res.status(200).json({
        success: true,
        message: 'Location updated successfully',
        location: users[userIndex].location
    });
});
// Toggle driver mode
exports.setDriverMode = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { id } = req.user;
    const { isDriverMode } = req.body;
    // Find user
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    // Check if user is a driver
    if (users[userIndex].role !== 'driver') {
        return res.status(403).json({
            success: false,
            message: 'Only drivers can toggle driver mode'
        });
    }
    // Update driver mode
    users[userIndex].isDriverMode = isDriverMode;
    users[userIndex].updatedAt = new Date();
    // Send response
    res.status(200).json({
        success: true,
        message: `Driver mode ${isDriverMode ? 'enabled' : 'disabled'}`,
        isDriverMode: users[userIndex].isDriverMode
    });
});
