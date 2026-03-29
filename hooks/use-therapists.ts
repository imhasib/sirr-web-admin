'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { therapistService } from '@/services/therapist.service';
import { CreateTherapistRequest, UpdateTherapistRequest, TherapistListParams } from '@/types';
import { toast } from 'sonner';

// Query keys factory
export const therapistKeys = {
  all: ['therapists'] as const,
  lists: () => [...therapistKeys.all, 'list'] as const,
  list: (params?: TherapistListParams) => [...therapistKeys.lists(), params] as const,
  detail: (id: string) => [...therapistKeys.all, 'detail', id] as const,
};

// Get all therapists with pagination
export function useTherapists(params?: TherapistListParams) {
  return useQuery({
    queryKey: therapistKeys.list(params),
    queryFn: () => therapistService.getTherapists(params),
  });
}

// Get single therapist by ID
export function useTherapist(id: string) {
  return useQuery({
    queryKey: therapistKeys.detail(id),
    queryFn: () => therapistService.getTherapist(id),
    enabled: !!id,
  });
}

// Create therapist mutation
export function useCreateTherapist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTherapistRequest) => therapistService.createTherapist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: therapistKeys.lists() });
      toast.success('Therapist created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create therapist');
    },
  });
}

// Update therapist mutation
export function useUpdateTherapist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTherapistRequest }) =>
      therapistService.updateTherapist(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: therapistKeys.lists() });
      queryClient.setQueryData(therapistKeys.detail(response.data._id), response);
      toast.success('Therapist updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update therapist');
    },
  });
}

// Delete therapist mutation
export function useDeleteTherapist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => therapistService.deleteTherapist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: therapistKeys.lists() });
      toast.success('Therapist deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete therapist');
    },
  });
}
