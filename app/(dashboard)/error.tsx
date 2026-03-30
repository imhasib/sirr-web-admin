'use client';

import { ErrorFallback } from '@/components/common';

/**
 * Dashboard Error Boundary
 * Catches errors in the dashboard routes
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorFallback error={error} reset={reset} />;
}
