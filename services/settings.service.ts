import apiClient from '@/lib/api-client';
import { Setting, UpdateSettingRequest, PromptSchemasResponse } from '@/types';

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

  async getPromptSchemas(): Promise<PromptSchemasResponse> {
    const response = await apiClient.get<PromptSchemasResponse>('/admin/settings/prompt-schemas');
    return response.data;
  },
};

export default settingsService;
