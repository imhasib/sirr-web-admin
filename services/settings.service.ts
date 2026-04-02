import apiClient from '@/lib/api-client';
import { Setting, UpdateSettingRequest } from '@/types';

// Test request for partial entry prompts (detect-emotions-tags, help-me-reflect)
export interface TestPromptRequest {
  partialEntry: string;
}

// Test request for main reflection prompt
export interface TestMainReflectionRequest {
  prompt: string;
}

// Test request for Allah insights prompt
export interface TestAllahInsightsRequest {
  allahName: string;
  allahMeaning: string;
  journalEntries: string[];
}

// Union type for all possible test requests
export type AnyTestPromptRequest = TestPromptRequest | TestMainReflectionRequest | TestAllahInsightsRequest;

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

  async testPrompt(endpoint: string, data: AnyTestPromptRequest): Promise<TestPromptResponse> {
    const response = await apiClient.post<TestPromptResponse>(endpoint, data);
    return response.data;
  },
};

export default settingsService;
