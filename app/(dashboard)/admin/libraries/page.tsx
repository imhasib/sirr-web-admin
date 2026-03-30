'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, BookOpen } from 'lucide-react';
import { useLibraries, useDeleteLibrary } from '@/hooks/use-libraries';
import { Library } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable, PageHeader, EmptyState, ConfirmDialog } from '@/components/common';
import { RequireAdmin } from '@/components/auth';
import { createColumns } from './columns';
import Link from 'next/link';

export default function LibrariesPage() {
  const router = useRouter();
  const { data, isLoading, error } = useLibraries();
  const deleteLibrary = useDeleteLibrary();

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    library: Library | null;
  }>({ open: false, library: null });

  // Flatten all libraries from categories into a single array
  const allLibraries = useMemo(() => {
    if (!data?.categories) return [];
    return data.categories.flatMap((category) => category.libraries);
  }, [data]);

  const handleDelete = (library: Library) => {
    setDeleteDialog({ open: true, library });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.library) return;
    await deleteLibrary.mutateAsync(deleteDialog.library._id);
    setDeleteDialog({ open: false, library: null });
  };

  const columns = useMemo(() => createColumns({ onDelete: handleDelete }), []);

  if (error) {
    return (
      <RequireAdmin
        pageTitle="Library Management"
        pageDescription="Manage library resources"
      >
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load libraries. Please try again later.
          </AlertDescription>
        </Alert>
      </RequireAdmin>
    );
  }

  return (
    <RequireAdmin
      pageTitle="Library Management"
      pageDescription="Manage library resources"
    >
      <div className="space-y-6">
        <PageHeader
          title="Library Management"
          description="Manage library resources and content"
          actions={
            <Button asChild>
              <Link href="/admin/libraries/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Library
              </Link>
            </Button>
          }
        />

      {isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : allLibraries.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No library items"
          description="Get started by adding your first library resource."
          action={
            <Button asChild>
              <Link href="/admin/libraries/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Library
              </Link>
            </Button>
          }
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Libraries ({allLibraries.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={allLibraries}
              searchKey="name"
              searchPlaceholder="Search libraries..."
              onRowClick={(library) => router.push(`/admin/libraries/${library._id}`)}
            />
          </CardContent>
        </Card>
      )}

        <ConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, library: null })}
          title="Delete Library"
          description={`Are you sure you want to delete "${deleteDialog.library?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={confirmDelete}
          isDestructive
          isLoading={deleteLibrary.isPending}
        />
      </div>
    </RequireAdmin>
  );
}
