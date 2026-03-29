export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'SIRR Admin';

export const AUTH_TOKEN_KEY = 'sirr_access_token';
export const REFRESH_TOKEN_KEY = 'sirr_refresh_token';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
  PROMPT_SETTINGS: '/settings/prompts',
  // Admin routes
  ADMIN_LIBRARIES: '/admin/libraries',
  ADMIN_LIBRARIES_NEW: '/admin/libraries/new',
  ADMIN_THERAPISTS: '/admin/therapists',
  ADMIN_THERAPISTS_NEW: '/admin/therapists/new',
  ADMIN_ONBOARDING: '/admin/onboarding',
  ADMIN_ONBOARDING_NEW: '/admin/onboarding/new',
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
