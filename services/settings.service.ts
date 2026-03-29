import apiClient from '@/lib/api-client';
import { Setting, UpdateSettingRequest, PromptSchemasResponse } from '@/types';

export const settingsService = {
  async getSettings(): Promise<Setting[]> {
    const response = await apiClient.get<Setting[]>('/settings');
    return response.data;
  },

  async getSetting(key: string): Promise<Setting> {
    const response = await apiClient.get<Setting>(`/settings/${key}`);
    return response.data;
  },

  async updateSetting(key: string, data: UpdateSettingRequest): Promise<Setting> {
    const response = await apiClient.put<Setting>(`/settings/${key}`, data);
    return response.data;
  },

  async getPromptSchemas(): Promise<PromptSchemasResponse> {
    const response = await apiClient.get<PromptSchemasResponse>('/settings/prompt-schemas');
    return response.data;
  },
};

export default settingsService;
