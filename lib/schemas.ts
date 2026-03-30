import { z } from 'zod';

// ============================================================================
// Auth Schemas
// ============================================================================

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ============================================================================
// Library Schemas
// ============================================================================

export const librarySchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description must be less than 2000 characters'),
  link: z.string().url('Must be a valid URL'),
  duration: z.string().min(1, 'Duration is required'),
  category: z.string().min(1, 'Category is required'),
  premium: z.boolean().default(true),
});

// ============================================================================
// Therapist Schemas
// ============================================================================

export const therapistSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  title: z.string().max(100, 'Title must be less than 100 characters').optional(),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
  gender: z.string().optional(),
  tags: z.string().optional(),
  photo: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  userId: z.string().optional(),
});

// ============================================================================
// Onboarding Schemas
// ============================================================================

export const onboardingOptionSchema = z.object({
  slug: z.string().min(1, 'Option slug is required'),
  label: z.string().min(1, 'Option label is required'),
  description: z.string().optional(),
});

export const onboardingQuestionSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9_]+$/, 'Slug must be lowercase with underscores only')
    .optional(), // Optional for edit form
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  subtitle: z.string().max(500, 'Subtitle must be less than 500 characters').optional(),
  stepLabel: z.string().max(100, 'Step label must be less than 100 characters').optional(),
  selectionType: z.enum(['single', 'multiple']),
  minSelections: z.coerce.number().min(0, 'Min selections must be at least 0').default(1),
  order: z.coerce.number().min(0, 'Order must be at least 0').default(0),
  isActive: z.boolean().default(true).optional(), // Optional for create form
  options: z.array(onboardingOptionSchema).min(1, 'At least one option is required'),
});

// Schema for creating onboarding questions (requires slug)
export const createOnboardingQuestionSchema = onboardingQuestionSchema.required({ slug: true });

// Schema for editing onboarding questions (slug not editable, isActive required)
export const editOnboardingQuestionSchema = onboardingQuestionSchema.omit({ slug: true }).required({ isActive: true });

// ============================================================================
// Type Exports
// ============================================================================

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type LibraryFormData = z.infer<typeof librarySchema>;
export type TherapistFormData = z.infer<typeof therapistSchema>;
export type OnboardingOptionFormData = z.infer<typeof onboardingOptionSchema>;
export type OnboardingQuestionFormData = z.infer<typeof onboardingQuestionSchema>;
export type CreateOnboardingQuestionFormData = z.infer<typeof createOnboardingQuestionSchema>;
export type EditOnboardingQuestionFormData = z.infer<typeof editOnboardingQuestionSchema>;
