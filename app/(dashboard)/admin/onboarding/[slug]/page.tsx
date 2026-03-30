'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  ListOrdered,
  Hash,
  Calendar,
} from 'lucide-react';
import { useOnboardingQuestion, useDeleteOnboardingQuestion } from '@/hooks/use-onboarding';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader, ConfirmDialog } from '@/components/common';
import { RequireAdmin } from '@/components/auth';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';

export default function OnboardingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data, isLoading, error } = useOnboardingQuestion(slug);
  const deleteQuestion = useDeleteOnboardingQuestion();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const question = data;

  const handleDelete = async () => {
    await deleteQuestion.mutateAsync(slug);
    router.push('/admin/onboarding');
  };

  if (isLoading) {
    return (
      <RequireAdmin
        pageTitle="Question Details"
        backHref="/admin/onboarding"
      >
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

  if (error || !question) {
    return (
      <RequireAdmin
        pageTitle="Question Details"
        backHref="/admin/onboarding"
      >
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load question details. The question may not exist.
          </AlertDescription>
        </Alert>
      </RequireAdmin>
    );
  }

  return (
    <RequireAdmin
      pageTitle="Question Details"
      backHref="/admin/onboarding"
    >
    <div className="space-y-6">
      <PageHeader
        title={question.title}
        description="Onboarding question details"
        backHref="/admin/onboarding"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href={`/admin/onboarding/${slug}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Hash className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Slug</p>
                <p className="font-mono">{question.slug}</p>
              </div>
            </div>

            {question.subtitle && (
              <div>
                <p className="text-sm text-muted-foreground">Subtitle</p>
                <p className="font-medium">{question.subtitle}</p>
              </div>
            )}

            {question.stepLabel && (
              <div>
                <p className="text-sm text-muted-foreground">Step Label</p>
                <p className="font-medium">{question.stepLabel}</p>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <ListOrdered className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Selection Type</p>
                <Badge variant="secondary" className="capitalize">
                  {question.selectionType}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Min Selections</p>
                <p className="font-medium">{question.minSelections}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order</p>
                <p className="font-medium">{question.order}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              {question.isActive ? (
                <Badge variant="default" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Active
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <XCircle className="h-3 w-3" />
                  Inactive
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Options ({question.options.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {question.options
                .sort((a, b) => a.order - b.order)
                .map((option, index) => (
                  <div
                    key={option.slug}
                    className="flex items-start gap-3 rounded-lg border p-3"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {option.slug}
                      </p>
                      {option.description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {option.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="font-mono text-sm">{question._id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Version</p>
                <p className="font-medium">{question.version}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{formatDateTime(question.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Updated</p>
                <p className="font-medium">{formatDateTime(question.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Question"
        description={`Are you sure you want to delete "${question.title}"? This action cannot be undone.`}
                  confirmText="Delete"
          onConfirm={handleDelete}
          isDestructive
          isLoading={deleteQuestion.isPending}
        />
      </div>
    </RequireAdmin>
  );
}
