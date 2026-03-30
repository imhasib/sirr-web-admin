'use client';

import { ReactNode } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/common';

interface RequireAdminProps {
  children: ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  backHref?: string;
  loadingTitle?: string;
  accessDeniedTitle?: string;
  accessDeniedMessage?: string;
}

/**
 * Component that requires admin access to render children.
 * Shows loading state during auth check and access denied message for non-admins.
 */
export function RequireAdmin({
  children,
  pageTitle = 'Admin Page',
  pageDescription,
  backHref,
  loadingTitle,
  accessDeniedTitle = 'Access Denied',
  accessDeniedMessage = 'You do not have permission to access this page.',
}: RequireAdminProps) {
  const { user, isLoading } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={loadingTitle || pageTitle}
          description={pageDescription}
          backHref={backHref}
        />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[200px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px]" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied for non-admins
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={pageTitle}
          description={pageDescription}
          backHref={backHref}
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{accessDeniedTitle}</AlertTitle>
          <AlertDescription>{accessDeniedMessage}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Render children for admin users
  return <>{children}</>;
}
