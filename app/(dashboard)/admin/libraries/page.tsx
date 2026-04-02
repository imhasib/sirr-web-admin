'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { useLibraries, useDeleteLibrary } from '@/hooks/use-libraries';
import { Library } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ListPageLayout, ConfirmDialog } from '@/components/common';
import { RequireAdmin } from '@/components/auth';
import { createColumns } from './columns';

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
      <ListPageLayout
        title="Library Management"
        description="Manage library resources and content"
        data={allLibraries}
        columns={columns}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Search libraries..."
        addButton={{
          href: '/admin/libraries/new',
          label: 'Add Library',
        }}
        emptyState={{
          icon: BookOpen,
          title: 'No library items',
          description: 'Get started by adding your first library resource.',
        }}
        onRowClick={(library) => router.push(`/admin/libraries/${library._id}`)}
      />

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
    </RequireAdmin>
  );
}
