import apiClient, { setTokens, clearTokens } from '@/lib/api-client';
import { AuthResponse, LoginCredentials, RegisterData, ChangePasswordData } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    const { tokens } = response.data;
    setTokens(tokens.accessToken, tokens.refreshToken);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse & { message?: string }> {
    const { confirmPassword, ...registerData } = data;
    const response = await apiClient.post<AuthResponse & { message?: string }>('/auth/register', registerData);
    // Don't set tokens - user will need to sign in after registration
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore logout errors
    } finally {
      clearTokens();
    }
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post(`/auth/reset-password/${token}`, { password });
  },

  async verifyEmail(token: string): Promise<void> {
    await apiClient.get(`/auth/verify-email/${token}`);
  },

  async resendVerificationEmail(email: string): Promise<void> {
    await apiClient.post('/auth/resend-verification', { email });
  },

  async changePassword(data: ChangePasswordData): Promise<void> {
    const { confirmPassword, ...passwordData } = data;
    await apiClient.post('/auth/change-password', passwordData);
  },
};

export default authService;
