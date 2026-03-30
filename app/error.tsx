'use client';

import { ErrorFallback } from '@/components/common';

/**
 * Root Error Boundary
 * Catches errors in the root layout and all child segments
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorFallback error={error} reset={reset} showHomeButton={false} />;
}
