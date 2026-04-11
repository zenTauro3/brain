export const config = {
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:3000/api",
    timeout: 15000,
  },
  auth: {
    accessTokenKey: "auth_token",
    refreshTokenKey: "refresh_token",
  },
  environment: process.env.NODE_ENV || "development",
} as const;

export type Config = typeof config;
