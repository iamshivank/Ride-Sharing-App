import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST']
  }
});

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import rideRoutes from './routes/ride.routes';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Ride-Share API' });
});

// Error handler middleware
app.use(errorHandler);

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