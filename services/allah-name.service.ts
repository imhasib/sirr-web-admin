import apiClient from '@/lib/api-client';
import {
  AllahName,
  CreateAllahNameRequest,
  UpdateAllahNameRequest,
  AllahNameListParams,
} from '@/types';

export const allahNameService = {
  async getAllahNames(params?: AllahNameListParams): Promise<AllahName[]> {
    const response = await apiClient.get<AllahName[]>('/admin/allah-names', {
      params,
    });
    return response.data;
  },

  async getAllahName(id: string): Promise<AllahName> {
    const response = await apiClient.get<AllahName>(`/admin/allah-names/${id}`);
    return response.data;
  },

  async createAllahName(data: CreateAllahNameRequest): Promise<AllahName> {
    const response = await apiClient.post<AllahName>('/admin/allah-names', data);
    return response.data;
  },

  async updateAllahName(id: string, data: UpdateAllahNameRequest): Promise<AllahName> {
    const response = await apiClient.patch<AllahName>(`/admin/allah-names/${id}`, data);
    return response.data;
  },

  async deactivateAllahName(id: string): Promise<AllahName> {
    const response = await apiClient.post<AllahName>(`/admin/allah-names/${id}/deactivate`);
    return response.data;
  },

  async deleteAllahName(id: string): Promise<void> {
    await apiClient.delete(`/admin/allah-names/${id}`);
  },
};

export default allahNameService;
