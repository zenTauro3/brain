import * as SecureStore from 'expo-secure-store';
import { apiClient } from "../client";
import { ApiSuccessResponse } from "../../types/api";
import { LoginRequest, RegisterRequest, AuthResponse } from "../../types/auth";
import { config } from "@/config/env.config";

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<
      any,
      ApiSuccessResponse<AuthResponse>
    >("/auth/login", credentials);

    const { access_token, refresh_token } = response.data;

    await Promise.all([
      SecureStore.setItemAsync(config.auth.tokenKey, access_token),
      SecureStore.setItemAsync(config.auth.refreshTokenKey, refresh_token),
    ]);

    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<
      any,
      ApiSuccessResponse<AuthResponse>
    >("/auth/register", userData);

    const { access_token, refresh_token } = response.data;

    await Promise.all([
      SecureStore.setItemAsync(config.auth.tokenKey, access_token),
      SecureStore.setItemAsync(config.auth.refreshTokenKey, refresh_token),
    ]);

    return response.data;
  },

  logout: async (): Promise<void> => {
    await Promise.all([
      SecureStore.deleteItemAsync(config.auth.tokenKey),
      SecureStore.deleteItemAsync(config.auth.refreshTokenKey),
    ]);
  },

  isAuthenticated: async (): Promise<boolean> => {
    const token = await SecureStore.getItemAsync(config.auth.tokenKey);
    return !!token;
  },
};