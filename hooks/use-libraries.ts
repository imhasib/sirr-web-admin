'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { libraryService } from '@/services/library.service';
import { CreateLibraryRequest, UpdateLibraryRequest } from '@/types';
import { toast } from 'sonner';

// Query keys factory
export const libraryKeys = {
  all: ['libraries'] as const,
  lists: () => [...libraryKeys.all, 'list'] as const,
  detail: (id: string) => [...libraryKeys.all, 'detail', id] as const,
};

// Get all libraries (grouped by category)
export function useLibraries() {
  return useQuery({
    queryKey: libraryKeys.lists(),
    queryFn: () => libraryService.getLibraries(),
  });
}

// Get single library by ID
export function useLibrary(id: string) {
  return useQuery({
    queryKey: libraryKeys.detail(id),
    queryFn: () => libraryService.getLibrary(id),
    enabled: !!id,
  });
}

// Create library mutation
export function useCreateLibrary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLibraryRequest) => libraryService.createLibrary(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.lists() });
      toast.success('Library item created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create library item');
    },
  });
}

// Update library mutation
export function useUpdateLibrary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLibraryRequest }) =>
      libraryService.updateLibrary(id, data),
    onSuccess: (updatedLibrary) => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.lists() });
      queryClient.setQueryData(libraryKeys.detail(updatedLibrary._id), updatedLibrary);
      toast.success('Library item updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update library item');
    },
  });
}

// Delete library mutation
export function useDeleteLibrary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => libraryService.deleteLibrary(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.lists() });
      toast.success('Library item deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete library item');
    },
  });
}
