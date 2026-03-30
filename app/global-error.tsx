'use client';

import { ErrorFallback } from '@/components/common';

/**
 * Global Error Boundary
 * Catches errors in the root layout (including the root layout itself)
 * This is only used in production and must include html and body tags
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <ErrorFallback error={error} reset={reset} showHomeButton={false} />
      </body>
    </html>
  );
}
