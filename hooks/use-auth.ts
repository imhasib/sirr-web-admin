'use client';

import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';
import { ApiError } from '@/types';
import { clearAllAppStorage, clearAllAppCookies } from '@/lib/storage';

function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    return (err as ApiError).message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return 'An unexpected error occurred';
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: storeLogin,
    register: storeRegister,
    logout: storeLogout,
    checkAuth,
    clearError,
  } = useAuthStore();

  const login = async (email: string, password: string) => {
    try {
      await storeLogin(email, password);
      toast.success('Welcome back!');
      // Use window.location for full page reload to ensure cookies are sent
      window.location.href = ROUTES.DASHBOARD;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      toast.error(errorMessage);
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const result = await storeRegister(name, email, password);
      const successMessage = result.message || 'Account created successfully! Please sign in to continue.';
      toast.success(successMessage);
      // Redirect to login page after successful registration
      router.push(ROUTES.LOGIN);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      toast.error(errorMessage);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await storeLogout();
    } catch {
      // Continue with cleanup even if logout API fails
    } finally {
      // Clear all React Query cache to prevent data leakage
      queryClient.clear();

      // Clear all localStorage, sessionStorage, and cookies
      clearAllAppStorage();
      clearAllAppCookies();

      toast.success('You have been logged out.');
      router.push(ROUTES.LOGIN);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
    clearError,
  };
}
