import { create } from "zustand";
import { router } from "expo-router";
import { authService } from "../api/services/auth.service";
import { tokenService } from "../api/services/token.service";
import { LoginRequest, RegisterRequest } from "@/types/auth";
import { UserData } from "@/types/user";

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  initialize: () => Promise<void>;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    try {
      const { accessToken, refreshToken } = await tokenService.getTokens();

      if (!accessToken || !refreshToken) {
        return set({ isAuthenticated: false, isLoading: false, user: null });
      }

      const userData = await authService.getMe();

      set({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      await get().logout();
      set({ isLoading: false });

      throw error;
    }
  },

  login: async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);
      console.log(response);

      set({
        isAuthenticated: true,
        user: response.user,
      });

      router.replace("/(chat)");
    } catch (error) {
      throw error;
    }
  },

  register: async (userData: RegisterRequest) => {
    try {
      const response = await authService.register(userData);
      console.log(response);

      set({
        isAuthenticated: true,
        user: response.user,
      });

      router.replace("/(chat)");
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await tokenService.clearTokens();

      set({ isAuthenticated: false, user: null });

      router.replace("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  },
}));
