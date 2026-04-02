'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Users, ArrowLeft } from 'lucide-react';
import { useTherapists, useDeleteTherapist } from '@/hooks/use-therapists';
import { Therapist } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable, PageHeader, EmptyState, ConfirmDialog } from '@/components/common';
import { RequireAdmin } from '@/components/auth';
import { createColumns } from './columns';
import { ROUTES } from '@/lib/constants';
import Link from 'next/link';

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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.DASHBOARD)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title="Therapist Management"
          description="Manage therapist profiles and information"
          actions={
            <Button asChild>
              <Link href="/admin/therapists/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Therapist
              </Link>
            </Button>
          }
        />
      </div>

      {isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : therapists.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No therapists"
          description="Get started by adding your first therapist profile."
          action={
            <Button asChild>
              <Link href="/admin/therapists/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Therapist
              </Link>
            </Button>
          }
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Therapists ({therapists.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={therapists}
              searchKey="name"
              searchPlaceholder="Search therapists..."
              onRowClick={(therapist) => router.push(`/admin/therapists/${therapist._id}`)}
            />
          </CardContent>
        </Card>
      )}

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
      </div>
    </RequireAdmin>
  );
}
