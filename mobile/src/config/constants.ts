// API Configuration
export const API_URL = 'http://10.0.2.2:5000'; // Use this for Android emulator
// export const API_URL = 'http://localhost:5000'; // Use this for iOS simulator
// export const API_URL = 'https://your-production-api.com'; // Production API

// Map Configuration
export const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

// App Theme Colors
export const COLORS = {
  primary: '#2E86C1',
  secondary: '#3498DB',
  accent: '#F39C12',
  background: '#F8F9F9',
  white: '#FFFFFF',
  black: '#000000',
  lightGray: '#EAECEE',
  mediumGray: '#BDC3C7',
  darkGray: '#7F8C8D',
  success: '#2ECC71',
  error: '#E74C3C',
  warning: '#F1C40F',
  info: '#3498DB',
  textDark: '#2C3E50',
  textLight: '#ECF0F1',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

// Ride Types
export const RIDE_TYPES = [
  {
    id: 'STANDARD',
    name: 'Standard',
    description: 'Regular ride, affordable for everyone',
    multiplier: 1,
    icon: 'car',
  },
  {
    id: 'PREMIUM',
    name: 'Premium',
    description: 'Luxury vehicles with top-rated drivers',
    multiplier: 1.5,
    icon: 'car-sports',
  },
  {
    id: 'SHARED',
    name: 'Shared',
    description: 'Share your ride and split the cost',
    multiplier: 0.7,
    icon: 'account-group',
  },
];

// Ride Status
export enum RIDE_STATUS {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

// Map styles for dark mode
export const MAP_DARK_STYLE = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#212121',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#212121',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#181818',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#1b1b1b',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#2c2c2c',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#8a8a8a',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      {
        color: '#373737',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#3c3c3c',
      },
    ],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [
      {
        color: '#4e4e4e',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#000000',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#3d3d3d',
      },
    ],
  },
]; 