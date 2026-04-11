import axios from "axios";
import { config } from "@/config/env.config";
import { tokenService } from "./services/token.service";

export const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(async (req) => {
  const { accessToken } = await tokenService.getTokens();
  if (accessToken && req.headers) {
    req.headers.Authorization = `Bearer ${accessToken}`;
  }
  return req;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes("/auth/")) {
      originalRequest._retry = true;

      try {
        const { refreshToken } = await tokenService.getTokens(); 
        if (!refreshToken) throw new Error("No refresh token");

        const refreshResponse = await axios.post(`${config.api.baseUrl}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const data = refreshResponse.data.data || refreshResponse.data;
        const newToken = data.access_token;
        const newRefresh = data.refresh_token || refreshToken;

        // ✅ AÑADIDO EL AWAIT QUE FALTABA
        await tokenService.saveTokens(newToken, newRefresh); 

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        
        import("@/store/authStore").then((module) => {
          module.useAuthStore.getState().logout();
        });
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);