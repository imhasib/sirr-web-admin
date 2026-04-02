'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Book } from 'lucide-react';
import {
  useAllahNames,
  useDeactivateAllahName,
  useDeleteAllahName,
} from '@/hooks/use-allah-names';
import { AllahName } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable, PageHeader, EmptyState, ConfirmDialog } from '@/components/common';
import { RequireAdmin } from '@/components/auth';
import { createColumns } from './columns';
import Link from 'next/link';

export default function AllahNamesPage() {
  const router = useRouter();
  const [includeInactive, setIncludeInactive] = useState(false);

  const { data, isLoading, error } = useAllahNames({
    limit: 100,
    includeInactive,
  });
  const deactivateAllahName = useDeactivateAllahName();
  const deleteAllahName = useDeleteAllahName();

  const [deactivateDialog, setDeactivateDialog] = useState<{
    open: boolean;
    name: AllahName | null;
  }>({ open: false, name: null });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    name: AllahName | null;
  }>({ open: false, name: null });

  const allahNames = data || [];

  const handleDeactivate = (name: AllahName) => {
    setDeactivateDialog({ open: true, name });
  };

  const handleDelete = (name: AllahName) => {
    setDeleteDialog({ open: true, name });
  };

  const confirmDeactivate = async () => {
    if (!deactivateDialog.name) return;
    await deactivateAllahName.mutateAsync(deactivateDialog.name._id);
    setDeactivateDialog({ open: false, name: null });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.name) return;
    await deleteAllahName.mutateAsync(deleteDialog.name._id);
    setDeleteDialog({ open: false, name: null });
  };

  const columns = useMemo(
    () =>
      createColumns({
        onDeactivate: handleDeactivate,
        onDelete: handleDelete,
      }),
    []
  );

  if (error) {
    return (
      <RequireAdmin
        pageTitle="Allah Names Management"
        pageDescription="Manage Allah's 99 Beautiful Names"
      >
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load Allah names. Please try again later.
          </AlertDescription>
        </Alert>
      </RequireAdmin>
    );
  }

  return (
    <RequireAdmin
      pageTitle="Allah Names Management"
      pageDescription="Manage Allah's 99 Beautiful Names"
    >
      <div className="space-y-6">
        <PageHeader
          title="Allah Names Management"
          description="Manage Allah's 99 Beautiful Names with Quranic references"
          actions={
            <Button asChild>
              <Link href="/admin/allah-names/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Allah Name
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
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : allahNames.length === 0 ? (
          <EmptyState
            icon={Book}
            title="No Allah names"
            description="Get started by adding Allah's Beautiful Names."
            action={
              <Button asChild>
                <Link href="/admin/allah-names/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Allah Name
                </Link>
              </Button>
            }
          />
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Allah Names ({allahNames.length})</CardTitle>
                <Select
                  value={includeInactive ? 'all' : 'active'}
                  onValueChange={(value) => setIncludeInactive(value === 'all')}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="all">All (Include Inactive)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={allahNames}
                searchKey="transliteration"
                searchPlaceholder="Search by transliteration or meaning..."
                onRowClick={(name) => router.push(`/admin/allah-names/${name._id}`)}
              />
            </CardContent>
          </Card>
        )}

        <ConfirmDialog
          open={deactivateDialog.open}
          onOpenChange={(open) => setDeactivateDialog({ open, name: null })}
          title="Deactivate Allah Name"
          description={`Are you sure you want to deactivate "${deactivateDialog.name?.transliteration}"? This will hide it from users but you can reactivate it later.`}
          confirmText="Deactivate"
          onConfirm={confirmDeactivate}
          isDestructive={false}
          isLoading={deactivateAllahName.isPending}
        />

        <ConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, name: null })}
          title="Delete Allah Name Permanently"
          description={`Are you sure you want to permanently delete "${deleteDialog.name?.transliteration}"? This action cannot be undone.`}
          confirmText="Delete Permanently"
          onConfirm={confirmDelete}
          isDestructive
          isLoading={deleteAllahName.isPending}
        />
      </div>
    </RequireAdmin>
  );
}
