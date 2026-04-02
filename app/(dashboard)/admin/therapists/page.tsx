'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';
import { useTherapists, useDeleteTherapist } from '@/hooks/use-therapists';
import { Therapist } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ListPageLayout, ConfirmDialog } from '@/components/common';
import { RequireAdmin } from '@/components/auth';
import { createColumns } from './columns';

export default function TherapistsPage() {
  const router = useRouter();
  const { data, isLoading, error } = useTherapists({ limit: 100 });
  const deleteTherapist = useDeleteTherapist();

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    therapist: Therapist | null;
  }>({ open: false, therapist: null });

  const therapists = data?.data?.profiles || [];

  const handleDelete = (therapist: Therapist) => {
    setDeleteDialog({ open: true, therapist });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.therapist) return;
    await deleteTherapist.mutateAsync(deleteDialog.therapist._id);
    setDeleteDialog({ open: false, therapist: null });
  };

  const columns = useMemo(() => createColumns({ onDelete: handleDelete }), []);

  if (error) {
    return (
      <RequireAdmin
        pageTitle="Therapist Management"
        pageDescription="Manage therapist profiles"
      >
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load therapists. Please try again later.
          </AlertDescription>
        </Alert>
      </RequireAdmin>
    );
  }

  return (
    <RequireAdmin
      pageTitle="Therapist Management"
      pageDescription="Manage therapist profiles"
    >
      <ListPageLayout
        title="Therapist Management"
        description="Manage therapist profiles and information"
        data={therapists}
        columns={columns}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Search therapists..."
        addButton={{
          href: '/admin/therapists/new',
          label: 'Add Therapist',
        }}
        emptyState={{
          icon: Users,
          title: 'No therapists',
          description: 'Get started by adding your first therapist profile.',
        }}
        onRowClick={(therapist) => router.push(`/admin/therapists/${therapist._id}`)}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, therapist: null })}
        title="Delete Therapist"
        description={`Are you sure you want to delete "${deleteDialog.therapist?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        isDestructive
        isLoading={deleteTherapist.isPending}
      />
    </RequireAdmin>
  );
}
