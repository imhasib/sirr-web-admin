export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'SIRR Admin';

export const AUTH_TOKEN_KEY = 'sirr_access_token';
export const REFRESH_TOKEN_KEY = 'sirr_refresh_token';

export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Protected routes
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
  PROMPT_SETTINGS: '/settings/prompts',
  GENERAL_SETTINGS: '/settings/general',
  PROFILE_SETTINGS: '/settings/profile',
  PASSWORD_SETTINGS: '/settings/password',

  // Admin - Libraries
  ADMIN_LIBRARIES: '/admin/libraries',
  ADMIN_LIBRARIES_NEW: '/admin/libraries/new',

  // Admin - Therapists
  ADMIN_THERAPISTS: '/admin/therapists',
  ADMIN_THERAPISTS_NEW: '/admin/therapists/new',

  // Admin - Onboarding
  ADMIN_ONBOARDING: '/admin/onboarding',
  ADMIN_ONBOARDING_NEW: '/admin/onboarding/new',

  // Admin - Allah Names
  ADMIN_ALLAH_NAMES: '/admin/allah-names',
  ADMIN_ALLAH_NAMES_NEW: '/admin/allah-names/new',

  // Admin - Metrics (Soul Mirror Performance)
  ADMIN_METRICS: '/admin/metrics',
} as const;

/**
 * Dynamic route generators
 * Use these functions to generate routes with IDs/slugs
 */
export const DYNAMIC_ROUTES = {
  // Library routes
  adminLibraryDetail: (id: string) => `/admin/libraries/${id}`,
  adminLibraryEdit: (id: string) => `/admin/libraries/${id}/edit`,

  // Therapist routes
  adminTherapistDetail: (id: string) => `/admin/therapists/${id}`,
  adminTherapistEdit: (id: string) => `/admin/therapists/${id}/edit`,

  // Onboarding routes
  adminOnboardingDetail: (slug: string) => `/admin/onboarding/${slug}`,
  adminOnboardingEdit: (slug: string) => `/admin/onboarding/${slug}/edit`,

  // Allah Names routes
  adminAllahNameDetail: (id: string) => `/admin/allah-names/${id}`,
  adminAllahNameEdit: (id: string) => `/admin/allah-names/${id}/edit`,
} as const;

export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
];

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;
