import { Request, Response } from 'express';
import { catchAsync } from '../middlewares/errorHandler';

// Temporary data storage (will be replaced with Prisma)
const rides: any[] = [];

// Request a ride
export const requestRide = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const { 
    pickupLocation,
    dropoffLocation,
    rideType = 'standard',
    estimatedPrice,
    estimatedDistance,
    estimatedDuration
  } = req.body;

  // Validate required fields
  if (!pickupLocation || !dropoffLocation) {
    return res.status(400).json({
      success: false,
      message: 'Pickup and dropoff locations are required'
    });
  }

  // Create ride request
  const newRide = {
    id: Date.now().toString(),
    riderId: userId,
    driverId: null,
    status: 'pending',
    pickupLocation,
    dropoffLocation,
    rideType,
    estimatedPrice,
    estimatedDistance,
    estimatedDuration,
    actualPrice: null,
    startTime: null,
    endTime: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  rides.push(newRide);

  // Send response
  res.status(201).json({
    success: true,
    ride: newRide
  });
});

// Accept a ride
export const acceptRide = catchAsync(async (req: Request, res: Response) => {
  const { id: driverId } = req.user;
  const { id: rideId } = req.params;

  // Find ride
  const rideIndex = rides.findIndex(ride => ride.id === rideId);
  if (rideIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Ride not found'
    });
  }

  // Check if ride is still pending
  if (rides[rideIndex].status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: `Ride cannot be accepted. Current status: ${rides[rideIndex].status}`
    });
  }

  // Update ride
  rides[rideIndex].driverId = driverId;
  rides[rideIndex].status = 'accepted';
  rides[rideIndex].updatedAt = new Date();

  // Send response
  res.status(200).json({
    success: true,
    ride: rides[rideIndex]
  });
});

// Get ride by ID
export const getRideById = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const { id: rideId } = req.params;

  // Find ride
  const ride = rides.find(ride => ride.id === rideId);
  if (!ride) {
    return res.status(404).json({
      success: false,
      message: 'Ride not found'
    });
  }

  // Check if user is associated with the ride
  if (ride.riderId !== userId && ride.driverId !== userId) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized to access this ride'
    });
  }

  // Send response
  res.status(200).json({
    success: true,
    ride
  });
});

// Get user's rides
export const getUserRides = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const { status, role } = req.query;

  // Filter rides by user and optional status
  let userRides = rides.filter(ride => {
    // Filter by user role (rider or driver)
    if (role === 'rider') {
      return ride.riderId === userId;
    } else if (role === 'driver') {
      return ride.driverId === userId;
    } else {
      return ride.riderId === userId || ride.driverId === userId;
    }
  });

  // Filter by status if provided
  if (status) {
    userRides = userRides.filter(ride => ride.status === status);
  }

  // Sort by creation date (newest first)
  userRides.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Send response
  res.status(200).json({
    success: true,
    count: userRides.length,
    rides: userRides
  });
});

// Cancel a ride
export const cancelRide = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const { id: rideId } = req.params;
  const { reason } = req.body;

  // Find ride
  const rideIndex = rides.findIndex(ride => ride.id === rideId);
  if (rideIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Ride not found'
    });
  }

  // Check if user is associated with the ride
  if (rides[rideIndex].riderId !== userId && rides[rideIndex].driverId !== userId) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized to cancel this ride'
    });
  }

  // Check if ride can be canceled
  const cancelableStatuses = ['pending', 'accepted'];
  if (!cancelableStatuses.includes(rides[rideIndex].status)) {
    return res.status(400).json({
      success: false,
      message: `Ride cannot be canceled. Current status: ${rides[rideIndex].status}`
    });
  }

  // Update ride
  rides[rideIndex].status = 'canceled';
  rides[rideIndex].cancelReason = reason;
  rides[rideIndex].canceledBy = userId;
  rides[rideIndex].updatedAt = new Date();

  // Send response
  res.status(200).json({
    success: true,
    message: 'Ride canceled successfully',
    ride: rides[rideIndex]
  });
});

// Complete a ride
export const completeRide = catchAsync(async (req: Request, res: Response) => {
  const { id: driverId } = req.user;
  const { id: rideId } = req.params;
  const { actualPrice } = req.body;

  // Find ride
  const rideIndex = rides.findIndex(ride => ride.id === rideId);
  if (rideIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Ride not found'
    });
  }

  // Check if user is the driver
  if (rides[rideIndex].driverId !== driverId) {
    return res.status(403).json({
      success: false,
      message: 'Only the assigned driver can complete this ride'
    });
  }

  // Check if ride is in progress
  if (rides[rideIndex].status !== 'in_progress') {
    return res.status(400).json({
      success: false,
      message: `Ride cannot be completed. Current status: ${rides[rideIndex].status}`
    });
  }

  // Update ride
  rides[rideIndex].status = 'completed';
  rides[rideIndex].actualPrice = actualPrice || rides[rideIndex].estimatedPrice;
  rides[rideIndex].endTime = new Date();
  rides[rideIndex].updatedAt = new Date();

  // Send response
  res.status(200).json({
    success: true,
    message: 'Ride completed successfully',
    ride: rides[rideIndex]
  });
});

// Rate a ride
export const rateRide = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const { id: rideId } = req.params;
  const { rating, comment } = req.body;

  // Validate rating
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be between 1 and 5'
    });
  }

  // Find ride
  const rideIndex = rides.findIndex(ride => ride.id === rideId);
  if (rideIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Ride not found'
    });
  }

  // Check if user is associated with the ride
  if (rides[rideIndex].riderId !== userId && rides[rideIndex].driverId !== userId) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized to rate this ride'
    });
  }

  // Check if ride is completed
  if (rides[rideIndex].status !== 'completed') {
    return res.status(400).json({
      success: false,
      message: 'Only completed rides can be rated'
    });
  }

  // Determine if rider or driver is rating
  const isRider = rides[rideIndex].riderId === userId;
  
  // Update ride with rating
  if (isRider) {
    rides[rideIndex].driverRating = rating;
    rides[rideIndex].driverComment = comment;
  } else {
    rides[rideIndex].riderRating = rating;
    rides[rideIndex].riderComment = comment;
  }
  
  rides[rideIndex].updatedAt = new Date();

  // Send response
  res.status(200).json({
    success: true,
    message: 'Rating submitted successfully',
    ride: rides[rideIndex]
  });
});

// Get available rides for drivers
export const getAvailableRides = catchAsync(async (req: Request, res: Response) => {
  const { id: driverId } = req.user;
  const { latitude, longitude, radius = 5 } = req.query; // radius in km

  // Get pending rides
  const pendingRides = rides.filter(ride => ride.status === 'pending');

  // Filter by distance if location provided
  // In a real implementation, we would calculate actual distance
  // between driver location and pickup location
  let availableRides = pendingRides;
  
  if (latitude && longitude) {
    // Simulate distance filtering
    // In a real app, we'd use geospatial queries
    availableRides = pendingRides;
  }

  // Sort by creation time (newest first)
  availableRides.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Send response
  res.status(200).json({
    success: true,
    count: availableRides.length,
    rides: availableRides
  });
});

// Update ride location (from driver)
export const updateRideLocation = catchAsync(async (req: Request, res: Response) => {
  const { id: driverId } = req.user;
  const { id: rideId } = req.params;
  const { currentLocation, status } = req.body;

  // Find ride
  const rideIndex = rides.findIndex(ride => ride.id === rideId);
  if (rideIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Ride not found'
    });
  }

  // Check if user is the driver
  if (rides[rideIndex].driverId !== driverId) {
    return res.status(403).json({
      success: false,
      message: 'Only the assigned driver can update this ride'
    });
  }

  // Update location
  if (currentLocation) {
    rides[rideIndex].currentLocation = currentLocation;
  }

  // Update status if provided
  if (status) {
    // Only allow certain status transitions
    const allowedTransitions: Record<string, string[]> = {
      'accepted': ['in_progress', 'canceled'],
      'in_progress': ['completed', 'canceled']
    };

    if (
      allowedTransitions[rides[rideIndex].status] &&
      allowedTransitions[rides[rideIndex].status].includes(status)
    ) {
      rides[rideIndex].status = status;
      
      // Set start time if ride is starting
      if (status === 'in_progress' && !rides[rideIndex].startTime) {
        rides[rideIndex].startTime = new Date();
      }
      
      // Set end time if ride is completed
      if (status === 'completed') {
        rides[rideIndex].endTime = new Date();
      }
    } else {
      return res.status(400).json({
        success: false,
        message: `Cannot update status from ${rides[rideIndex].status} to ${status}`
      });
    }
  }

  rides[rideIndex].updatedAt = new Date();

  // Send response
  res.status(200).json({
    success: true,
    message: 'Ride updated successfully',
    ride: rides[rideIndex]
  });
}); 