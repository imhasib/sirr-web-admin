'use client';

import { useAuthStore } from '@/stores/auth-store';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

/**
 * Shows a warning banner when user is logged in but not an admin.
 * Only displays after auth has loaded to prevent flash.
 */
export function AdminAccessWarning() {
  const { user, isLoading } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  // Don't show anything while auth is loading or if user is admin
  if (isLoading || isAdmin) {
    return null;
  }

  return (
    <Alert variant="warning">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Limited Access</AlertTitle>
      <AlertDescription>
        You are logged in as a regular user. Some admin features may not be available to you.
        Contact your administrator if you need elevated permissions.
      </AlertDescription>
    </Alert>
  );
}
