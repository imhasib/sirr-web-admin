'use client';

import { useParams } from 'next/navigation';
import { Mail, Monitor, User, Clock } from 'lucide-react';
import { useFeedback } from '@/hooks/use-feedback';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/common';
import { RequireAdmin } from '@/components/auth';
import { formatDateTime } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

export default function FeedbackDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: feedback, isLoading, error, notFound } = useFeedback(id);

  if (isLoading) {
    return (
      <RequireAdmin pageTitle="Feedback Details" backHref={ROUTES.ADMIN_FEEDBACK}>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </CardContent>
        </Card>
      </RequireAdmin>
    );
  }

  if (error || notFound || !feedback) {
    return (
      <RequireAdmin pageTitle="Feedback Details" backHref={ROUTES.ADMIN_FEEDBACK}>
        <Alert variant="destructive">
          <AlertTitle>Not found</AlertTitle>
          <AlertDescription>
            This feedback entry could not be loaded. It may have been removed.
          </AlertDescription>
        </Alert>
      </RequireAdmin>
    );
  }

  return (
    <RequireAdmin pageTitle="Feedback Details" backHref={ROUTES.ADMIN_FEEDBACK}>
      <div className="space-y-6">
        <PageHeader
          title="Feedback Details"
          description={`Submitted ${formatDateTime(feedback.createdAt)}`}
          backHref={ROUTES.ADMIN_FEEDBACK}
        />

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Message</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                {feedback.message}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submitter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium break-words">{feedback.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${feedback.email}`}
                    className="font-medium text-primary hover:underline break-all"
                  >
                    {feedback.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Monitor className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Screen</p>
                  {feedback.screenName ? (
                    <Badge variant="outline" className="font-mono text-xs">
                      {feedback.screenName}
                    </Badge>
                  ) : (
                    <p className="text-sm text-muted-foreground">-</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">ID</p>
                  <p className="font-mono text-sm break-all">{feedback._id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Created
                  </p>
                  <p className="font-medium">{formatDateTime(feedback.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-mono text-sm break-all">
                    {feedback.userId ?? '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RequireAdmin>
  );
}
