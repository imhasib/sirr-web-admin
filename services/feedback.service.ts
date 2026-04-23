import apiClient from '@/lib/api-client';
import { FeedbackListParams, FeedbackListResponse } from '@/types';

export const feedbackService = {
  async getFeedbacks(params?: FeedbackListParams): Promise<FeedbackListResponse> {
    const response = await apiClient.get<FeedbackListResponse>('/admin/feedback', { params });
    return response.data;
  },
};

export default feedbackService;
