/**
 * Storage utility for managing app-wide localStorage and sessionStorage
 */

// All localStorage keys used by the app
const APP_STORAGE_KEYS = [
  'sirr-auth',
  'auth_token',
  'refresh_token',
];

/**
 * Clear all application data from localStorage and sessionStorage
 * This should be called on logout to prevent data leakage between users
 */
export function clearAllAppStorage(): void {
  if (typeof window === 'undefined') return;

  // Clear specific app keys
  APP_STORAGE_KEYS.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });

  // Also clear any keys that start with our app prefixes (for safety)
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('sirr-') || key.startsWith('auth_') || key.startsWith('refresh_'))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));

  // Clear sessionStorage as well
  const sessionKeysToRemove: string[] = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && (key.startsWith('sirr-') || key.startsWith('auth_') || key.startsWith('refresh_'))) {
      sessionKeysToRemove.push(key);
    }
  }
  sessionKeysToRemove.forEach((key) => sessionStorage.removeItem(key));
}

/**
 * Clear all cookies related to the app
 */
export function clearAllAppCookies(): void {
  if (typeof window === 'undefined') return;

  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();

    // Clear auth-related cookies
    if (name.startsWith('auth_') || name.startsWith('refresh_') || name.startsWith('sirr')) {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  }
}
