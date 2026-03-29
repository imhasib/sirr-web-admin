'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Pencil, Trash2, ExternalLink, Clock, Tag, Star } from 'lucide-react';
import { useLibrary, useDeleteLibrary } from '@/hooks/use-libraries';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader, ConfirmDialog } from '@/components/common';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';

export default function LibraryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { user } = useAuthStore();
  const { data: library, isLoading, error } = useLibrary(id);
  const deleteLibrary = useDeleteLibrary();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isAdmin = user?.role === 'admin';

  const handleDelete = async () => {
    await deleteLibrary.mutateAsync(id);
    router.push('/admin/libraries');
  };

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <PageHeader title="Library Details" backHref="/admin/libraries" />
        <Alert variant="destructive">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Library Details" backHref="/admin/libraries" />
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
      </div>
    );
  }

  if (error || !library) {
    return (
      <div className="space-y-6">
        <PageHeader title="Library Details" backHref="/admin/libraries" />
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load library details. The item may not exist.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={library.name}
        description="Library item details"
        backHref="/admin/libraries"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <a href={library.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Link
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/admin/libraries/${id}/edit`}>
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
                <Tag className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <Badge variant="secondary">{library.category}</Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{library.duration}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Star className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Access</p>
                <Badge variant={library.premium ? 'default' : 'outline'}>
                  {library.premium ? 'Premium' : 'Free'}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <ExternalLink className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">Link</p>
                <a
                  href={library.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline truncate block"
                >
                  {library.link}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {library.description}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="font-mono text-sm">{library._id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{formatDateTime(library.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Updated</p>
                <p className="font-medium">{formatDateTime(library.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Library"
        description={`Are you sure you want to delete "${library.name}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        isDestructive
        isLoading={deleteLibrary.isPending}
      />
    </div>
  );
}
