export const SelectionType = {
  SINGLE: 'single',
  MULTIPLE: 'multiple',
} as const;

export type SelectionTypeValue = (typeof SelectionType)[keyof typeof SelectionType];

export interface OnboardingOption {
  slug: string;
  label: string;
  description?: string;
  order: number;
}

export interface OnboardingQuestion {
  _id: string;
  slug: string;
  title: string;
  subtitle?: string;
  stepLabel?: string;
  selectionType: SelectionTypeValue;
  minSelections: number;
  options: OnboardingOption[];
  order: number;
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOnboardingQuestionRequest {
  slug: string;
  title: string;
  subtitle?: string;
  stepLabel?: string;
  selectionType: SelectionTypeValue;
  minSelections?: number;
  options: Omit<OnboardingOption, 'order'>[];
  order?: number;
}

export interface UpdateOnboardingQuestionRequest {
  title?: string;
  subtitle?: string;
  stepLabel?: string;
  selectionType?: SelectionTypeValue;
  minSelections?: number;
  options?: Omit<OnboardingOption, 'order'>[];
  order?: number;
  isActive?: boolean;
}

export interface OnboardingQuestionsResponse {
  questions: OnboardingQuestion[];
}

// Single question response is the question object directly
export type OnboardingQuestionResponse = OnboardingQuestion;
