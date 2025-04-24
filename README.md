# RideShare - Mobile Ride-Sharing Application

A fullstack scalable ride-sharing mobile application built with modern web technologies. This application allows riders to book rides and drivers to accept and complete rides, all in real-time.

## 📱 Features

### For Riders

- User authentication (email/password, Google OAuth)
- Book rides with pickup and dropoff locations
- View real-time driver location
- Track ride history
- Rate drivers after completed rides
- View ride details and receipts
- Profile management

### For Drivers

- Driver mode toggle
- Accept or decline ride requests
- Navigation to pickup and dropoff locations
- Track earnings
- View ride history
- Rate riders after completed rides
- Profile management

### General Features

- Real-time location tracking
- Push notifications
- Secure payments
- JWT-based authentication
- Role-based access control

## 🛠️ Tech Stack

### Frontend (Mobile)

- React Native with TypeScript
- Expo for rapid development
- React Navigation for navigation
- Socket.IO Client for real-time communication
- Formik & Yup for form validation
- React Native Maps for maps integration
- Axios for API communication

### Backend (API)

- Node.js with Express
- TypeScript for type safety
- JWT for authentication
- Socket.IO for real-time communication
- Prisma ORM for database operations
- Centralized error handling

### Database

- PostgreSQL
- Prisma schema for type safety

## 📂 Project Structure

```
ride-share-app/
├── mobile/                 # React Native mobile app
│   ├── src/
│   │   ├── assets/         # Images, icons, etc.
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context providers
│   │   ├── hooks/          # Custom hooks
│   │   ├── navigation/     # Navigation setup
│   │   ├── screens/        # Screen components
│   │   │   ├── auth/       # Authentication screens
│   │   │   ├── rider/      # Rider-specific screens
│   │   │   └── driver/     # Driver-specific screens
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── App.tsx             # Main app component
│   └── package.json        # Dependencies
│
├── api/                    # Express.js backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── middlewares/    # Express middlewares
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── index.ts            # Entry point
│   └── package.json        # Dependencies
│
├── prisma/                 # Prisma ORM
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
│
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- PostgreSQL database
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ride-share-app.git
   cd ride-share-app
   ```

2. Install dependencies:

   ```bash
   # Install API dependencies
   cd api
   npm install

   # Install mobile app dependencies
   cd ../mobile
   npm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env` in the api directory
   - Update database connection string and other configuration

4. Set up the database:

   ```bash
   cd ../api
   npx prisma migrate dev
   ```

5. Start the development servers:

   ```bash
   # Start the API server
   cd ../api
   npm run dev

   # Start the mobile app
   cd ../mobile
   npm start
   ```

## 📱 Mobile App Development

- Press `a` to run on Android emulator/device
- Press `i` to run on iOS simulator (macOS only)
- Press `w` to run in web browser

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/google` - Google OAuth login/register

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/profile` - Delete user profile
- `PUT /api/users/location` - Update user location
- `PUT /api/users/driver-mode` - Toggle driver mode

### Rides

- `POST /api/rides/request` - Request a new ride
- `PUT /api/rides/:id/accept` - Accept a ride request
- `GET /api/rides/:id` - Get ride by ID
- `GET /api/rides/user/history` - Get user's rides (history)
- `PUT /api/rides/:id/cancel` - Cancel a ride
- `PUT /api/rides/:id/complete` - Complete a ride
- `POST /api/rides/:id/rate` - Rate a completed ride
- `GET /api/rides/available/requests` - Get available ride requests
- `PUT /api/rides/:id/location` - Update ride location (driver)

## 📢 Real-time Events

The application uses Socket.IO for real-time communication between clients and the server.

### Server Events

- `new-ride-request` - Emitted when a new ride is requested
- `ride-accepted-{rideId}` - Emitted when a driver accepts a ride
- `location-{rideId}` - Emitted when location is updated

### Client Events

- `request-ride` - Sent when a rider requests a ride
- `accept-ride` - Sent when a driver accepts a ride
- `location-update` - Sent when a user's location is updated

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgements

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [Socket.IO](https://socket.io/)
- [Google Maps API](https://developers.google.com/maps)
