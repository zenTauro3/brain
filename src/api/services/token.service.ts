import * as SecureStore from "expo-secure-store";
import { config } from "@/config/env.config";

export const tokenService = {
  saveTokens: async (accessToken: string, refreshToken: string) => {
    await Promise.all([
      SecureStore.setItemAsync(config.auth.accessTokenKey, accessToken),
      SecureStore.setItemAsync(config.auth.refreshTokenKey, refreshToken),
    ]);
  },

  clearTokens: async (): Promise<void> => {
    await Promise.all([
      SecureStore.deleteItemAsync(config.auth.accessTokenKey),
      SecureStore.deleteItemAsync(config.auth.refreshTokenKey),
    ]);
  },

  getTokens: async (): Promise<{ accessToken: string | null; refreshToken: string | null }> => {
    const accessToken = await SecureStore.getItemAsync(config.auth.accessTokenKey);
    const refreshToken = await SecureStore.getItemAsync(config.auth.refreshTokenKey);
    return { accessToken, refreshToken };
  },
};