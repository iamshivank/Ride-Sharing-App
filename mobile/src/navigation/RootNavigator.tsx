import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Navigation Stacks
import AuthStack from './AuthStack';
import RiderStack from './RiderStack';
import DriverStack from './DriverStack';

// Define the types for our navigation parameters
export type RootStackParamList = {
  Auth: undefined;
  Rider: undefined;
  Driver: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking auth status
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3498DB" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        // User is not authenticated, show auth stack
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        // User is authenticated, show appropriate stack based on role
        user?.role === 'DRIVER' ? (
          <Stack.Screen name="Driver" component={DriverStack} />
        ) : (
          <Stack.Screen name="Rider" component={RiderStack} />
        )
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator; 