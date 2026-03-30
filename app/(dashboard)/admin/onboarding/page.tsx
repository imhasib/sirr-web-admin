'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  ClipboardList,
} from 'lucide-react';
import { useOnboardingQuestions, useDeleteOnboardingQuestion } from '@/hooks/use-onboarding';
import { OnboardingQuestion } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader, ConfirmDialog, EmptyState } from '@/components/common';
import { RequireAdmin } from '@/components/auth';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';

export default function OnboardingListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useOnboardingQuestions();
  const deleteQuestion = useDeleteOnboardingQuestion();

  const [search, setSearch] = useState('');
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);

  const questions = data?.questions || [];

  const filteredQuestions = questions.filter(
    (q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (deleteSlug) {
      await deleteQuestion.mutateAsync(deleteSlug);
      setDeleteSlug(null);
    }
  };

  return (
    <RequireAdmin pageTitle="Onboarding Questions">
    <div className="space-y-6">
      <PageHeader
        title="Onboarding Questions"
        description="Manage onboarding questions and options"
        actions={
          <Button asChild>
            <Link href="/admin/onboarding/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Link>
          </Button>
        }
      />

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load onboarding questions. Please try again.
          </AlertDescription>
        </Alert>
      ) : filteredQuestions.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No onboarding questions"
          description={
            search
              ? 'No questions match your search.'
              : 'Get started by creating your first onboarding question.'
          }
          action={
            !search && (
              <Button asChild>
                <Link href="/admin/onboarding/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Link>
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredQuestions
            .sort((a, b) => a.order - b.order)
            .map((question) => (
              <QuestionCard
                key={question._id}
                question={question}
                onView={() => router.push(`/admin/onboarding/${question.slug}`)}
                onEdit={() => router.push(`/admin/onboarding/${question.slug}/edit`)}
                onDelete={() => setDeleteSlug(question.slug)}
              />
            ))}
        </div>
      )}

        <ConfirmDialog
          open={!!deleteSlug}
          onOpenChange={(open) => !open && setDeleteSlug(null)}
          title="Delete Question"
          description={`Are you sure you want to delete this question? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={handleDelete}
          isDestructive
          isLoading={deleteQuestion.isPending}
        />
      </div>
    </RequireAdmin>
  );
}

function QuestionCard({
  question,
  onView,
  onEdit,
  onDelete,
}: {
  question: OnboardingQuestion;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onView}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{question.title}</CardTitle>
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
          <p className="text-sm text-muted-foreground font-mono">{question.slug}</p>
        </div>
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {question.stepLabel && (
            <span className="flex items-center gap-1">
              Step: {question.stepLabel}
            </span>
          )}
          <span>
            Type:{' '}
            <Badge variant="outline" className="capitalize">
              {question.selectionType}
            </Badge>
          </span>
          <span>Options: {question.options.length}</span>
          <span>Order: {question.order}</span>
          <span>Updated: {formatDateTime(question.updatedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
