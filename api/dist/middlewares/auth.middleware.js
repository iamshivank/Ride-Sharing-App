"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const error = new Error('No token provided, authorization denied');
        error.statusCode = 401;
        return next(error);
    }
    try {
        // Verify token
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Set user data in request
        req.user = decoded;
        next();
    }
    catch (err) {
        const error = new Error('Token is not valid');
        error.statusCode = 401;
        next(error);
    }
};
exports.authMiddleware = authMiddleware;
