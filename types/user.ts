export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  profilePicture?: string;
  role: 'user' | 'admin';
  authProvider?: 'local' | 'google';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
  message?: string;
}

export interface UpdateProfileData {
  name: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
