'use client';

import { useAuthStore } from '@/stores/auth-store';

/**
 * Hook that provides admin authentication status.
 * Useful when you need programmatic access to admin state.
 *
 * @example
 * const { isAdmin, isLoading, isAuthenticated } = useRequireAdmin();
 *
 * if (isLoading) return <Loading />;
 * if (!isAdmin) return <AccessDenied />;
 * return <AdminContent />;
 */
export function useRequireAdmin() {
  const { user, isLoading, isAuthenticated } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  return {
    isAdmin,
    isLoading,
    isAuthenticated,
    user,
  };
}
