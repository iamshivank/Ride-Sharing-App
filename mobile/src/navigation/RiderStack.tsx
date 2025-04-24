import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../config/constants';

// Screens
import HomeScreen from '../screens/rider/HomeScreen';
import RideHistoryScreen from '../screens/rider/RideHistoryScreen';
import ProfileScreen from '../screens/rider/ProfileScreen';
import BookRideScreen from '../screens/rider/BookRideScreen';
import RideScreen from '../screens/rider/RideScreen';
import RideDetailsScreen from '../screens/rider/RideDetailsScreen';
import MapScreen from '../screens/rider/MapScreen';
import PaymentScreen from '../screens/rider/PaymentScreen';
import RateDriverScreen from '../screens/rider/RateDriverScreen';

// Define types for RiderStack
export type RiderTabParamList = {
  Home: undefined;
  History: undefined;
  Profile: undefined;
};

export type RiderStackParamList = {
  RiderTabs: undefined;
  BookRide: undefined;
  Ride: { rideId: string };
  RideDetails: { rideId: string };
  Map: { pickupLocation?: any; dropoffLocation?: any };
  Payment: { rideId: string; amount: number };
  RateDriver: { rideId: string; driverId: string };
};

const Tab = createBottomTabNavigator<RiderTabParamList>();
const Stack = createStackNavigator<RiderStackParamList>();

// Tab Navigator for the main rider screens
const RiderTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = '';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={RideHistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Main stack navigator for the rider flow
const RiderStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="RiderTabs"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="RiderTabs" component={RiderTabs} />
      <Stack.Screen name="BookRide" component={BookRideScreen} />
      <Stack.Screen name="Ride" component={RideScreen} />
      <Stack.Screen name="RideDetails" component={RideDetailsScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="RateDriver" component={RateDriverScreen} />
    </Stack.Navigator>
  );
};

export default RiderStack; 