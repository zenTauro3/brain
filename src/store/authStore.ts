import { create } from "zustand";
import { router } from "expo-router";
import { authService } from "../api/services/auth.service";
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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    try {
      const isAuth = await authService.isAuthenticated();

      // NOTA SENIOR: Aquí, si isAuth es true, podrías llamar a un endpoint
      // 'auth/me' para recuperar los datos reales del usuario (email, username).

      set({
        isAuthenticated: isAuth,
        isLoading: false,
      });
    } catch (error) {
      set({ isAuthenticated: false, isLoading: false });
    }
  },

  login: async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);

      set({
        isAuthenticated: true,
        user: null,
      });

      router.replace("/(chat)");
    } catch (error) {
      throw error;
    }
  },

  register: async (userData: RegisterRequest) => {
    try {
      await authService.register(userData);

      set({ isAuthenticated: true });

      router.replace("/(chat)");
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
      set({ isAuthenticated: false, user: null });

      router.replace("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  },
}));
