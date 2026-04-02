'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { allahNameService } from '@/services/allah-name.service';
import {
  CreateAllahNameRequest,
  UpdateAllahNameRequest,
  AllahNameListParams,
} from '@/types';
import { toast } from 'sonner';

// Query keys factory
export const allahNameKeys = {
  all: ['allah-names'] as const,
  lists: () => [...allahNameKeys.all, 'list'] as const,
  list: (params?: AllahNameListParams) => [...allahNameKeys.lists(), params] as const,
  detail: (id: string) => [...allahNameKeys.all, 'detail', id] as const,
};

// Get all Allah names with pagination and filtering
export function useAllahNames(params?: AllahNameListParams) {
  return useQuery({
    queryKey: allahNameKeys.list(params),
    queryFn: () => allahNameService.getAllahNames(params),
  });
}

// Get single Allah name by ID
export function useAllahName(id: string) {
  return useQuery({
    queryKey: allahNameKeys.detail(id),
    queryFn: () => allahNameService.getAllahName(id),
    enabled: !!id,
  });
}

// Create Allah name mutation
export function useCreateAllahName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAllahNameRequest) => allahNameService.createAllahName(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allahNameKeys.lists() });
      toast.success('Allah name created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create Allah name');
    },
  });
}

// Update Allah name mutation
export function useUpdateAllahName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAllahNameRequest }) =>
      allahNameService.updateAllahName(id, data),
    onSuccess: (allahName) => {
      queryClient.invalidateQueries({ queryKey: allahNameKeys.lists() });
      queryClient.setQueryData(allahNameKeys.detail(allahName._id), allahName);
      toast.success('Allah name updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update Allah name');
    },
  });
}

// Deactivate Allah name mutation (soft delete)
export function useDeactivateAllahName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => allahNameService.deactivateAllahName(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allahNameKeys.lists() });
      toast.success('Allah name deactivated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to deactivate Allah name');
    },
  });
}

// Delete Allah name mutation (hard delete)
export function useDeleteAllahName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => allahNameService.deleteAllahName(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allahNameKeys.lists() });
      toast.success('Allah name deleted permanently');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete Allah name');
    },
  });
}
