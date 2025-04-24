import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config/constants';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'RIDER' | 'DRIVER' | 'ADMIN';
  profileImg?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  googleAuth: (token: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already logged in using the token in storage
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        
        if (token) {
          // Set default headers for all axios requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Fetch user data
          const response = await axios.get(`${API_URL}/api/users/profile`);
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        // Clear token if it's invalid
        await AsyncStorage.removeItem('token');
        axios.defaults.headers.common['Authorization'] = '';
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      const { user, accessToken, refreshToken } = response.data;
      
      // Save tokens to storage
      await AsyncStorage.setItem('token', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      
      // Set default headers for all axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
        role,
      });

      const { user, accessToken, refreshToken } = response.data;
      
      // Save tokens to storage
      await AsyncStorage.setItem('token', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      
      // Set default headers for all axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      setUser(user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleAuth = async (token: string) => {
    setIsLoading(true);
    try {
      // Send Google token to the backend
      const response = await axios.post(`${API_URL}/api/auth/google`, { token });

      const { user, accessToken, refreshToken } = response.data;
      
      // Save tokens to storage
      await AsyncStorage.setItem('token', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      
      // Set default headers for all axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      setUser(user);
    } catch (error) {
      console.error('Google authentication failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      
      // Call logout API
      await axios.post(`${API_URL}/api/auth/logout`, { refreshToken });
      
      // Clear tokens and user data
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      
      // Clear default headers
      axios.defaults.headers.common['Authorization'] = '';
      
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local data even if API call fails
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      axios.defaults.headers.common['Authorization'] = '';
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        googleAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 