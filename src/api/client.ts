import axios from "axios";

const API_URL = "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = "tu_token_guardado";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
