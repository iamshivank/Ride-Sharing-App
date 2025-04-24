"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("./middlewares/errorHandler");
// Load environment variables
dotenv_1.default.config();
// Initialize Express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Create HTTP server
const server = http_1.default.createServer(app);
// Initialize Socket.IO
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'POST']
    }
});
// Middlewares
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const ride_routes_1 = __importDefault(require("./routes/ride.routes"));
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/rides', ride_routes_1.default);
// Home route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Ride-Share API' });
});
// Error handler middleware
app.use(errorHandler_1.errorHandler);
// Socket.IO connection handler
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    // Handle ride requests
    socket.on('request-ride', (data) => {
        // Emit to available drivers
        io.emit('new-ride-request', data);
    });
    // Handle ride acceptance
    socket.on('accept-ride', (data) => {
        // Notify rider that a driver accepted
        io.emit(`ride-accepted-${data.rideId}`, data);
    });
    // Handle location updates
    socket.on('location-update', (data) => {
        // Broadcast location to specific rider or driver
        io.emit(`location-${data.rideId}`, data);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
