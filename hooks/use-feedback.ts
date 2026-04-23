'use client';

import { useQuery } from '@tanstack/react-query';
import { feedbackService } from '@/services/feedback.service';
import { FeedbackListParams } from '@/types';

export const feedbackKeys = {
  all: ['feedback'] as const,
  lists: () => [...feedbackKeys.all, 'list'] as const,
  list: (params?: FeedbackListParams) => [...feedbackKeys.lists(), params] as const,
};

export function useFeedbacks(params?: FeedbackListParams) {
  return useQuery({
    queryKey: feedbackKeys.list(params),
    queryFn: () => feedbackService.getFeedbacks(params),
  });
}

export function useFeedback(id: string) {
  const query = useFeedbacks({ limit: 100 });
  const feedback = query.data?.feedbacks.find((f) => f._id === id);
  return {
    data: feedback,
    isLoading: query.isLoading,
    error: query.error,
    notFound: !query.isLoading && !query.error && !feedback,
  };
}
