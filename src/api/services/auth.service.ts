import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../client';
import { ApiSuccessResponse } from '../../types/api';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse 
} from '../../types/auth';

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<any, ApiSuccessResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );

    const { access_token, refresh_token } = response.data;

    await AsyncStorage.multiSet([
      ['auth_token', access_token],
      ['refresh_token', refresh_token],
    ]);

    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<any, ApiSuccessResponse<AuthResponse>>(
      '/auth/register',
      userData
    );

    const { access_token, refresh_token } = response.data;

    await AsyncStorage.multiSet([
      ['auth_token', access_token],
      ['refresh_token', refresh_token],
    ]);

    return response.data;
  },

  logout: async (): Promise<void> => {
    await AsyncStorage.multiRemove(['auth_token', 'refresh_token']);
  },

  isAuthenticated: async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem('auth_token');
    return !!token;
  }
};