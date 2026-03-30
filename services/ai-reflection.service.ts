import apiClient from '@/lib/api-client';

export interface NameOfAllah {
  arabic: string;
  transliteration: string;
  meaning: string;
  reflection: string;
  embodiment: string;
}

export interface AIReflectionResponse {
  mainReflection: string;
  islamicLens: string;
  patternIdentified: string;
  yourInvitation: string;
  nameOfAllah: NameOfAllah;
}

export interface AIReflectionRequest {
  prompt: string;
}

export const aiReflectionService = {
  async testReflection(data: AIReflectionRequest): Promise<AIReflectionResponse> {
    const response = await apiClient.post<AIReflectionResponse>(
      '/journals/reflection/admin/test',
      data
    );
    return response.data;
  },
};

export default aiReflectionService;
