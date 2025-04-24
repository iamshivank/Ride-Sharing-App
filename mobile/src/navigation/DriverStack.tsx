import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../config/constants';

// Screens
import DriverHomeScreen from '../screens/driver/DriverHomeScreen';
import DriverRideHistoryScreen from '../screens/driver/DriverRideHistoryScreen';
import DriverProfileScreen from '../screens/driver/DriverProfileScreen';
import DriverRideScreen from '../screens/driver/DriverRideScreen';
import DriverRideDetailsScreen from '../screens/driver/DriverRideDetailsScreen';
import DriverMapScreen from '../screens/driver/DriverMapScreen';
import RateRiderScreen from '../screens/driver/RateRiderScreen';
import RideRequestsScreen from '../screens/driver/RideRequestsScreen';

// Define types for DriverStack
export type DriverTabParamList = {
  Home: undefined;
  History: undefined;
  Profile: undefined;
};

export type DriverStackParamList = {
  DriverTabs: undefined;
  DriverRide: { rideId: string };
  DriverRideDetails: { rideId: string };
  DriverMap: { pickupLocation?: any; dropoffLocation?: any; rideId?: string };
  RateRider: { rideId: string; riderId: string };
  RideRequests: undefined;
};

const Tab = createBottomTabNavigator<DriverTabParamList>();
const Stack = createStackNavigator<DriverStackParamList>();

// Tab Navigator for the main driver screens
const DriverTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = '';

          if (route.name === 'Home') {
            iconName = focused ? 'car' : 'car-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.darkGray,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.lightGray,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name="Home" component={DriverHomeScreen} />
      <Tab.Screen name="History" component={DriverRideHistoryScreen} />
      <Tab.Screen name="Profile" component={DriverProfileScreen} />
    </Tab.Navigator>
  );
};

// Main stack navigator for the driver flow
const DriverStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="DriverTabs"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DriverTabs" component={DriverTabs} />
      <Stack.Screen name="DriverRide" component={DriverRideScreen} />
      <Stack.Screen name="DriverRideDetails" component={DriverRideDetailsScreen} />
      <Stack.Screen name="DriverMap" component={DriverMapScreen} />
      <Stack.Screen name="RateRider" component={RateRiderScreen} />
      <Stack.Screen name="RideRequests" component={RideRequestsScreen} />
    </Stack.Navigator>
  );
};

export default DriverStack; 