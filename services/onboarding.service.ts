import apiClient from '@/lib/api-client';
import {
  OnboardingQuestion,
  OnboardingQuestionsResponse,
  OnboardingQuestionResponse,
  CreateOnboardingQuestionRequest,
  UpdateOnboardingQuestionRequest,
} from '@/types';

export const onboardingService = {
  async getQuestions(): Promise<OnboardingQuestionsResponse> {
    const response = await apiClient.get<OnboardingQuestionsResponse>('/onboarding/admin/questions');
    return response.data;
  },

  async getQuestion(slug: string): Promise<OnboardingQuestionResponse> {
    const response = await apiClient.get<OnboardingQuestionResponse>(`/onboarding/questions/${slug}`);
    return response.data;
  },

  async createQuestion(data: CreateOnboardingQuestionRequest): Promise<{ success: boolean; message: string; data: OnboardingQuestion }> {
    const response = await apiClient.post<{ success: boolean; message: string; data: OnboardingQuestion }>(
      '/onboarding/admin/questions',
      data
    );
    return response.data;
  },

  async updateQuestion(slug: string, data: UpdateOnboardingQuestionRequest): Promise<{ success: boolean; message: string; data: OnboardingQuestion }> {
    const response = await apiClient.patch<{ success: boolean; message: string; data: OnboardingQuestion }>(
      `/onboarding/admin/questions/${slug}`,
      data
    );
    return response.data;
  },

  async deleteQuestion(slug: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `/onboarding/admin/questions/${slug}`
    );
    return response.data;
  },
};

export default onboardingService;
