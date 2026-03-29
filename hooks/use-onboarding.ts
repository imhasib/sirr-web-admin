'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { onboardingService } from '@/services/onboarding.service';
import { CreateOnboardingQuestionRequest, UpdateOnboardingQuestionRequest } from '@/types';
import { toast } from 'sonner';

// Query keys factory
export const onboardingKeys = {
  all: ['onboarding'] as const,
  lists: () => [...onboardingKeys.all, 'list'] as const,
  detail: (slug: string) => [...onboardingKeys.all, 'detail', slug] as const,
};

// Get all onboarding questions
export function useOnboardingQuestions() {
  return useQuery({
    queryKey: onboardingKeys.lists(),
    queryFn: () => onboardingService.getQuestions(),
  });
}

// Get single onboarding question by slug
export function useOnboardingQuestion(slug: string) {
  return useQuery({
    queryKey: onboardingKeys.detail(slug),
    queryFn: () => onboardingService.getQuestion(slug),
    enabled: !!slug,
  });
}

// Create onboarding question mutation
export function useCreateOnboardingQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOnboardingQuestionRequest) => onboardingService.createQuestion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.lists() });
      toast.success('Onboarding question created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create onboarding question');
    },
  });
}

// Update onboarding question mutation
export function useUpdateOnboardingQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: UpdateOnboardingQuestionRequest }) =>
      onboardingService.updateQuestion(slug, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: onboardingKeys.detail(variables.slug) });
      toast.success('Onboarding question updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update onboarding question');
    },
  });
}

// Delete onboarding question mutation
export function useDeleteOnboardingQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => onboardingService.deleteQuestion(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.lists() });
      toast.success('Onboarding question deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete onboarding question');
    },
  });
}
