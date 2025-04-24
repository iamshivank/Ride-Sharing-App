import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RiderStackParamList } from '../../navigation/RiderStack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { COLORS } from '../../config/constants';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import axios from 'axios';
import { API_URL } from '../../config/constants';

type HomeScreenNavigationProp = StackNavigationProp<RiderStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  const { location, errorMsg, startLocationUpdates } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [activeRide, setActiveRide] = useState<any>(null);
  const [recentDestinations, setRecentDestinations] = useState<any[]>([]);
  
  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  useEffect(() => {
    // Start location updates when screen mounts
    startLocationUpdates();
    
    // Fetch active ride if any
    fetchActiveRide();
    
    // Fetch recent destinations
    fetchRecentDestinations();
  }, []);

  const fetchActiveRide = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/api/rides/user/history?status=in_progress,accepted,pending`);
      
      if (response.data.rides.length > 0) {
        // Get the most recent active ride
        setActiveRide(response.data.rides[0]);
      }
    } catch (error) {
      console.error('Error fetching active ride:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentDestinations = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/rides/user/history?limit=3`);
      setRecentDestinations(response.data.rides);
    } catch (error) {
      console.error('Error fetching recent destinations:', error);
    }
  };

  const handleBookRide = () => {
    navigation.navigate('BookRide');
  };

  const handleActiveRide = () => {
    if (activeRide) {
      navigation.navigate('Ride', { rideId: activeRide.id });
    }
  };

  const renderMap = () => {
    if (!location) {
      return (
        <View style={styles.mapLoading}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      );
    }

    return (
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Your location"
        >
          <View style={styles.markerContainer}>
            <View style={styles.markerDot} />
          </View>
        </Marker>
      </MapView>
    );
  };

  const renderActiveRide = () => {
    if (!activeRide) return null;

    return (
      <TouchableOpacity style={styles.activeRideCard} onPress={handleActiveRide}>
        <View style={styles.activeRideLeft}>
          <View style={styles.activeRideIconContainer}>
            <Ionicons name="car" size={24} color={COLORS.white} />
          </View>
          <View>
            <Text style={styles.activeRideTitle}>Active Ride</Text>
            <Text style={styles.activeRideStatus}>{activeRide.status.replace('_', ' ')}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color={COLORS.darkGray} />
      </TouchableOpacity>
    );
  };

  const renderRecentDestinations = () => {
    if (recentDestinations.length === 0) {
      return (
        <Text style={styles.noRecentText}>No recent rides found</Text>
      );
    }

    return recentDestinations.map((ride, index) => (
      <TouchableOpacity 
        key={ride.id} 
        style={styles.recentDestinationItem}
        onPress={() => navigation.navigate('RideDetails', { rideId: ride.id })}
      >
        <View style={styles.recentDestinationIconContainer}>
          <Ionicons name="location" size={20} color={COLORS.primary} />
        </View>
        <View style={styles.recentDestinationContent}>
          <Text style={styles.recentDestinationName}>
            {ride.dropoffLocation.name || 'Unknown Location'}
          </Text>
          <Text style={styles.recentDestinationAddress} numberOfLines={1}>
            {ride.dropoffLocation.address || 'No address available'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.darkGray} />
      </TouchableOpacity>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Rider'}!</Text>
            <Text style={styles.subGreeting}>Where are you going today?</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('RiderTabs', { screen: 'Profile' })}
          >
            {user?.profileImg ? (
              <Image source={{ uri: user.profileImg }} style={styles.profileImage} />
            ) : (
              <Ionicons name="person-circle" size={40} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        </View>

        {/* Map Preview */}
        <View style={styles.mapContainer}>
          {renderMap()}
          
          {/* Book Ride Button */}
          <TouchableOpacity 
            style={styles.bookRideButton}
            onPress={handleBookRide}
          >
            <Text style={styles.bookRideText}>Book a Ride</Text>
          </TouchableOpacity>
        </View>

        {/* Active Ride Card (if any) */}
        {renderActiveRide()}

        {/* Recent Destinations */}
        <View style={styles.recentDestinationsContainer}>
          <Text style={styles.sectionTitle}>Recent Destinations</Text>
          <View style={styles.recentDestinationsList}>
            {renderRecentDestinations()}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => navigation.navigate('RiderTabs', { screen: 'History' })}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: COLORS.info }]}>
                <Ionicons name="time" size={24} color={COLORS.white} />
              </View>
              <Text style={styles.quickActionText}>Ride History</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon!')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: COLORS.accent }]}>
                <MaterialCommunityIcons name="ticket-percent" size={24} color={COLORS.white} />
              </View>
              <Text style={styles.quickActionText}>Promotions</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon!')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: COLORS.success }]}>
                <Ionicons name="help-buoy" size={24} color={COLORS.white} />
              </View>
              <Text style={styles.quickActionText}>Support</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon!')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: COLORS.error }]}>
                <Ionicons name="settings" size={24} color={COLORS.white} />
              </View>
              <Text style={styles.quickActionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  subGreeting: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginTop: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  mapContainer: {
    height: 250,
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: 'hidden',
    marginVertical: 15,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapLoading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.darkGray,
    fontSize: 14,
  },
  markerContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary + '40', // With opacity
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  bookRideButton: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  bookRideText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeRideCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeRideLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeRideIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activeRideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  activeRideStatus: {
    fontSize: 14,
    color: COLORS.darkGray,
    textTransform: 'capitalize',
  },
  recentDestinationsContainer: {
    paddingHorizontal: 20,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 15,
  },
  recentDestinationsList: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentDestinationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  recentDestinationIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentDestinationContent: {
    flex: 1,
  },
  recentDestinationName: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textDark,
  },
  recentDestinationAddress: {
    fontSize: 13,
    color: COLORS.darkGray,
    marginTop: 2,
  },
  noRecentText: {
    color: COLORS.darkGray,
    textAlign: 'center',
    paddingVertical: 15,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textDark,
  },
});

export default HomeScreen; 