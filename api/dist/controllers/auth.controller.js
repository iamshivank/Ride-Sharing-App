"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuth = exports.refreshToken = exports.logout = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("../middlewares/errorHandler");
// Temporary user storage (will be replaced with Prisma)
const users = [];
let refreshTokens = [];
// Generate JWT token
const generateToken = (user, expiresIn = '1h') => {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn });
};
// Generate Refresh token
const generateRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};
// Register a new user
exports.register = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { name, email, password, role = 'rider' } = req.body;
    // Check if user already exists
    if (users.find(user => user.email === email)) {
        return res.status(400).json({
            success: false,
            message: 'User already exists'
        });
    }
    // Hash password
    const salt = await bcrypt_1.default.genSalt(10);
    const hashedPassword = await bcrypt_1.default.hash(password, salt);
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
exports.login = (0, errorHandler_1.catchAsync)(async (req, res) => {
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
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
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
exports.logout = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { refreshToken } = req.body;
    // Remove refresh token
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});
// Refresh token
exports.refreshToken = (0, errorHandler_1.catchAsync)(async (req, res) => {
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
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
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
    }
    catch (err) {
        return res.status(403).json({
            success: false,
            message: 'Invalid refresh token'
        });
    }
});
// Google OAuth login/register
exports.googleAuth = (0, errorHandler_1.catchAsync)(async (req, res) => {
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
