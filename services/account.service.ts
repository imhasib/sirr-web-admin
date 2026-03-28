import apiClient from '@/lib/api-client';
import { User, UpdateProfileData } from '@/types';

export const accountService = {
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/account/me');
    return response.data;
  },

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await apiClient.patch<User>('/account/me', data);
    return response.data;
  },
};

export default accountService;
