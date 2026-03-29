import apiClient from '@/lib/api-client';
import {
  Library,
  CreateLibraryRequest,
  UpdateLibraryRequest,
  LibraryListResponse,
} from '@/types';

export const libraryService = {
  async getLibraries(): Promise<LibraryListResponse> {
    const response = await apiClient.get<LibraryListResponse>('/libraries');
    return response.data;
  },

  async getLibrary(id: string): Promise<Library> {
    const response = await apiClient.get<Library>(`/libraries/${id}`);
    return response.data;
  },

  async createLibrary(data: CreateLibraryRequest): Promise<Library> {
    const response = await apiClient.post<Library>('/libraries', data);
    return response.data;
  },

  async updateLibrary(id: string, data: UpdateLibraryRequest): Promise<Library> {
    const response = await apiClient.put<Library>(`/libraries/${id}`, data);
    return response.data;
  },

  async deleteLibrary(id: string): Promise<void> {
    await apiClient.delete(`/libraries/${id}`);
  },
};

export default libraryService;
