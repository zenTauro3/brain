export interface LoginRequest {
  email: string;
  passwordHash: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}
