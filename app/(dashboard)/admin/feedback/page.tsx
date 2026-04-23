'use client';

import { MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFeedbacks } from '@/hooks/use-feedback';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ListPageLayout } from '@/components/common';
import { RequireAdmin } from '@/components/auth';
import { DYNAMIC_ROUTES } from '@/lib/constants';
import { feedbackColumns } from './columns';

export default function FeedbackPage() {
  const router = useRouter();
  const { data, isLoading, error } = useFeedbacks({ limit: 100 });

  const feedbacks = data?.feedbacks || [];

  if (error) {
    return (
      <RequireAdmin
        pageTitle="User Feedback"
        pageDescription="View feedback submitted by beta users"
      >
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load feedback. Please try again later.
          </AlertDescription>
        </Alert>
      </RequireAdmin>
    );
  }

  return (
    <RequireAdmin
      pageTitle="User Feedback"
      pageDescription="View feedback submitted by beta users"
    >
      <ListPageLayout
        title="User Feedback"
        description="Feedback submitted by beta users from the mobile app"
        data={feedbacks}
        columns={feedbackColumns}
        isLoading={isLoading}
        searchKey="message"
        searchPlaceholder="Search feedback..."
        emptyState={{
          icon: MessageCircle,
          title: 'No feedback yet',
          description: 'Feedback from beta users will appear here.',
        }}
        onRowClick={(feedback) => router.push(DYNAMIC_ROUTES.adminFeedbackDetail(feedback._id))}
      />
    </RequireAdmin>
  );
}
