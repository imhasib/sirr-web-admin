export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const AUTH_TOKEN_KEY = 'sirr_access_token';
export const REFRESH_TOKEN_KEY = 'sirr_refresh_token';

// Get basePath from environment (e.g., '/sirr' or empty string)
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const ROUTES = {
  // Public routes
  HOME: `${BASE_PATH}/`,
  LOGIN: `${BASE_PATH}/login`,
  REGISTER: `${BASE_PATH}/register`,
  FORGOT_PASSWORD: `${BASE_PATH}/forgot-password`,
  RESET_PASSWORD: `${BASE_PATH}/reset-password`,

  // Protected routes
  DASHBOARD: `${BASE_PATH}/dashboard`,
  SETTINGS: `${BASE_PATH}/settings`,
  PROMPT_SETTINGS: `${BASE_PATH}/settings/prompts`,
  PROFILE_SETTINGS: `${BASE_PATH}/settings/profile`,
  PASSWORD_SETTINGS: `${BASE_PATH}/settings/password`,

  // Admin - Libraries
  ADMIN_LIBRARIES: `${BASE_PATH}/admin/libraries`,
  ADMIN_LIBRARIES_NEW: `${BASE_PATH}/admin/libraries/new`,

  // Admin - Therapists
  ADMIN_THERAPISTS: `${BASE_PATH}/admin/therapists`,
  ADMIN_THERAPISTS_NEW: `${BASE_PATH}/admin/therapists/new`,

  // Admin - Onboarding
  ADMIN_ONBOARDING: `${BASE_PATH}/admin/onboarding`,
  ADMIN_ONBOARDING_NEW: `${BASE_PATH}/admin/onboarding/new`,

  // Admin - Other
  ADMIN_AI_REFLECTION_TEST: `${BASE_PATH}/admin/ai-reflection-test`,
} as const;

/**
 * Dynamic route generators
 * Use these functions to generate routes with IDs/slugs
 */
export const DYNAMIC_ROUTES = {
  // Library routes
  adminLibraryDetail: (id: string) => `${BASE_PATH}/admin/libraries/${id}`,
  adminLibraryEdit: (id: string) => `${BASE_PATH}/admin/libraries/${id}/edit`,

  // Therapist routes
  adminTherapistDetail: (id: string) => `${BASE_PATH}/admin/therapists/${id}`,
  adminTherapistEdit: (id: string) => `${BASE_PATH}/admin/therapists/${id}/edit`,

  // Onboarding routes
  adminOnboardingDetail: (slug: string) => `${BASE_PATH}/admin/onboarding/${slug}`,
  adminOnboardingEdit: (slug: string) => `${BASE_PATH}/admin/onboarding/${slug}/edit`,
} as const;

export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
];

// Public routes WITHOUT basePath - for middleware use only
// (Next.js middleware receives pathnames with basePath stripped)
export const PUBLIC_ROUTES_NO_BASE_PATH = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;
