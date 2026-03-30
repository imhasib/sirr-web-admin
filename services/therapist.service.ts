import apiClient from '@/lib/api-client';
import {
  Therapist,
  CreateTherapistRequest,
  UpdateTherapistRequest,
  TherapistListParams,
  TherapistListResponse,
} from '@/types';

export const therapistService = {
  async getTherapists(params?: TherapistListParams): Promise<TherapistListResponse> {
    const response = await apiClient.get<TherapistListResponse>('/therapists', { params });
    return response.data;
  },

  async getTherapist(id: string): Promise<{ success: boolean; data: Therapist }> {
    const response = await apiClient.get<{ success: boolean; data: Therapist }>(`/therapists/${id}`);
    return response.data;
  },

  async createTherapist(data: CreateTherapistRequest): Promise<{ success: boolean; message: string; data: Therapist }> {
    const response = await apiClient.post<{ success: boolean; message: string; data: Therapist }>('/admin/therapists', data);
    return response.data;
  },

  async updateTherapist(id: string, data: UpdateTherapistRequest): Promise<{ success: boolean; message: string; data: Therapist }> {
    const response = await apiClient.put<{ success: boolean; message: string; data: Therapist }>(`/admin/therapists/${id}`, data);
    return response.data;
  },

  async deleteTherapist(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/admin/therapists/${id}`);
    return response.data;
  },
};

export default therapistService;
