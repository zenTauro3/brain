import { apiClient } from "../client";
import { tokenService } from "./token.service";
import { ApiSuccessResponse } from "@/types/api";
import { LoginRequest, RegisterRequest, AuthResponse } from "@/types/auth";
import { UserData } from "@/types/user";

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<
      any,
      ApiSuccessResponse<AuthResponse>
    >("/auth/login", credentials);
    console.log(response.data.access_token);
    await tokenService.saveTokens(
      response.data.access_token,
      response.data.refresh_token,
    );
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<
      any,
      ApiSuccessResponse<AuthResponse>
    >("/auth/register", userData);
    await tokenService.saveTokens(
      response.data.access_token,
      response.data.refresh_token,
    );
    return response.data;
  },

  getMe: async (): Promise<UserData> => {
    const response = await apiClient.get<any, ApiSuccessResponse<UserData>>(
      "/users/me",
    );
    return response.data;
  },
};
