import apiClient from '@/lib/api-client';
import {
  Library,
  CreateLibraryRequest,
  UpdateLibraryRequest,
  LibraryListResponse,
} from '@/types';

export const libraryService = {
  async getLibraries(): Promise<LibraryListResponse> {
    const response = await apiClient.get<any[]>('/admin/libraries');

    // Transform id to _id for consistency
    const libraries = response.data.map((lib: any) => ({
      ...lib,
      _id: lib.id || lib._id,
    }));

    // Group libraries by category
    const categoryMap = new Map<string, Library[]>();

    libraries.forEach((library) => {
      const category = library.category;
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(library);
    });

    // Transform into the expected response format
    const categories = Array.from(categoryMap.entries()).map(([name, libs]) => ({
      name: name as any,
      totalItem: libs.length,
      libraries: libs,
    }));

    return { categories };
  },

  async getLibrary(id: string): Promise<Library> {
    const response = await apiClient.get<any>(`/libraries/${id}`);
    const lib = response.data;
    // Transform id to _id for consistency
    return {
      ...lib,
      _id: lib.id || lib._id,
    };
  },

  async createLibrary(data: CreateLibraryRequest): Promise<Library> {
    const response = await apiClient.post<Library>('/admin/libraries', data);
    return response.data;
  },

  async updateLibrary(id: string, data: UpdateLibraryRequest): Promise<Library> {
    const response = await apiClient.put<Library>(`/admin/libraries/${id}`, data);
    return response.data;
  },

  async deleteLibrary(id: string): Promise<void> {
    await apiClient.delete(`/admin/libraries/${id}`);
  },
};

export default libraryService;
