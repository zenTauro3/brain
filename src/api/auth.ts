import { AuthResponse, LoginRequest } from "../types/auth";
import { apiClient } from "./client";

export const loginAPI = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post("/auth/login", data);
  return response.data;
};
