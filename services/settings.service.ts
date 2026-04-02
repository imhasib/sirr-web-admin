import apiClient from '@/lib/api-client';
import { Setting, UpdateSettingRequest } from '@/types';

export interface TestPromptRequest {
  input: string;
}

export interface TestPromptResponse {
  output: any;
  timestamp: string;
}

export const settingsService = {
  async getSettings(): Promise<Setting[]> {
    const response = await apiClient.get<Setting[]>('/admin/settings');
    return response.data;
  },

  async getSetting(key: string): Promise<Setting> {
    const response = await apiClient.get<Setting>(`/admin/settings/${key}`);
    return response.data;
  },

  async updateSetting(key: string, data: UpdateSettingRequest): Promise<Setting> {
    const response = await apiClient.put<Setting>(`/admin/settings/${key}`, data);
    return response.data;
  },

  async testPrompt(endpoint: string, data: TestPromptRequest): Promise<TestPromptResponse> {
    const response = await apiClient.post<TestPromptResponse>(endpoint, data);
    return response.data;
  },
};

export default settingsService;
