import React, { createContext, useState, useEffect, useContext } from 'react';
import * as Location from 'expo-location';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { API_URL } from '../config/constants';

export type LocationType = {
  latitude: number;
  longitude: number;
  heading?: number;
};

type LocationContextType = {
  location: LocationType | null;
  errorMsg: string | null;
  isUpdating: boolean;
  requestBackgroundLocationPermission: () => Promise<boolean>;
  startLocationUpdates: () => Promise<void>;
  stopLocationUpdates: () => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);
  
  const { user, isAuthenticated } = useAuth();

  // Initial location permission request
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          heading: currentLocation.coords.heading || 0,
        });
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMsg('Error getting location');
      }
    })();
  }, []);

  // Update backend when location changes for authenticated users
  useEffect(() => {
    if (isAuthenticated && location && user) {
      updateLocationOnServer();
    }
  }, [location, isAuthenticated, user]);

  const updateLocationOnServer = async () => {
    if (!location) return;
    
    try {
      await axios.put(`${API_URL}/api/users/location`, {
        latitude: location.latitude,
        longitude: location.longitude,
      });
    } catch (error) {
      console.error('Failed to update location on server:', error);
    }
  };

  const requestBackgroundLocationPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestBackgroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Background location permission error:', error);
      return false;
    }
  };

  const startLocationUpdates = async () => {
    try {
      // Stop any existing subscription
      if (locationSubscription) {
        stopLocationUpdates();
      }

      // Check foreground permissions first
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Start tracking location
      setIsUpdating(true);
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10, // meters
          timeInterval: 5000, // milliseconds
        },
        (newLocation) => {
          setLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            heading: newLocation.coords.heading || 0,
          });
        }
      );

      setLocationSubscription(subscription);
    } catch (error) {
      console.error('Error starting location updates:', error);
      setErrorMsg('Failed to start location tracking');
      setIsUpdating(false);
    }
  };

  const stopLocationUpdates = () => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
    setIsUpdating(false);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        errorMsg,
        isUpdating,
        requestBackgroundLocationPermission,
        startLocationUpdates,
        stopLocationUpdates,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}; 