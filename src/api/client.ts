import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import * as SecureStore from "expo-secure-store";
import { config } from "@/config/env.config";

export const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (axiosConfig: InternalAxiosRequestConfig) => {
    const token = await SecureStore.getItemAsync(config.auth.tokenKey);
    
    if (token && axiosConfig.headers) {
      axiosConfig.headers.Authorization = `Bearer ${token}`;
    }
    return axiosConfig;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await Promise.all([
        SecureStore.deleteItemAsync(config.auth.tokenKey),
        SecureStore.deleteItemAsync(config.auth.refreshTokenKey),
      ]);
      
      // NOTA SENIOR: En un futuro, aquí es donde deberías interceptar el 401,
      // leer el refresh_token, pedir un nuevo access_token a /auth/refresh,
      // guardarlo, y reintentar la petición original sin que el usuario lo note.
    }
    
    return Promise.reject(error.response?.data || error);
  },
);