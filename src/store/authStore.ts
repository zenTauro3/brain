import { create } from "zustand";
import { authService } from "../api/services/auth.service";
import { LoginRequest, RegisterRequest } from "@/types/auth";
import { UserData } from "@/types/user";
import { router } from "expo-router";

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, 

  initialize: async () => {
    try {
      const isAuth = await authService.isAuthenticated();
      set({ isAuthenticated: isAuth, isLoading: false });
    } catch {
      set({ isAuthenticated: false, isLoading: false });
    }
  },

  login: async (credentials) => {
    const response = await authService.login(credentials);
    set({ isAuthenticated: true, user: null }); 
    router.replace("/(tabs)");
  },

  register: async (data) => {
    await authService.register(data);
    set({ isAuthenticated: true });
    router.replace("/(tabs)");
  },

  logout: async () => {
    await authService.logout();
    set({ isAuthenticated: false, user: null });
    router.replace("/login");
  },
}));
