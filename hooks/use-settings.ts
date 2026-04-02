'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService, TestPromptRequest } from '@/services/settings.service';
import { UpdateSettingRequest } from '@/types';
import { toast } from 'sonner';

// Query keys factory
export const settingsKeys = {
  all: ['settings'] as const,
  lists: () => [...settingsKeys.all, 'list'] as const,
  detail: (key: string) => [...settingsKeys.all, 'detail', key] as const,
};

// Get all settings
export function useSettings() {
  return useQuery({
    queryKey: settingsKeys.lists(),
    queryFn: () => settingsService.getSettings(),
  });
}

// Get single setting by key
export function useSetting(key: string) {
  return useQuery({
    queryKey: settingsKeys.detail(key),
    queryFn: () => settingsService.getSetting(key),
    enabled: !!key,
  });
}

// Update setting mutation
export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, data }: { key: string; data: UpdateSettingRequest }) =>
      settingsService.updateSetting(key, data),
    onSuccess: (updatedSetting) => {
      // Invalidate and refetch settings list
      queryClient.invalidateQueries({ queryKey: settingsKeys.lists() });
      // Update the specific setting in cache
      queryClient.setQueryData(settingsKeys.detail(updatedSetting.key), updatedSetting);
      toast.success('Setting updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update setting');
    },
  });
}

// Test prompt mutation
export function useTestPrompt() {
  return useMutation({
    mutationFn: ({ endpoint, data }: { endpoint: string; data: TestPromptRequest }) =>
      settingsService.testPrompt(endpoint, data),
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to test prompt');
    },
  });
}
