'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Pencil, Trash2, Ban, Book } from 'lucide-react';
import {
  useAllahName,
  useDeactivateAllahName,
  useDeleteAllahName,
} from '@/hooks/use-allah-names';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader, ConfirmDialog } from '@/components/common';
import { RequireAdmin } from '@/components/auth';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';

export default function AllahNameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, isLoading, error } = useAllahName(id);
  const deactivateAllahName = useDeactivateAllahName();
  const deleteAllahName = useDeleteAllahName();

  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const allahName = data;

  const handleDeactivate = async () => {
    await deactivateAllahName.mutateAsync(id);
    setShowDeactivateDialog(false);
  };

  const handleDelete = async () => {
    await deleteAllahName.mutateAsync(id);
    router.push('/admin/allah-names');
  };

  if (isLoading) {
    return (
      <RequireAdmin pageTitle="Allah Name Details" backHref="/admin/allah-names">
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

  if (error || !allahName) {
    return (
      <RequireAdmin pageTitle="Allah Name Details" backHref="/admin/allah-names">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load Allah name details. The entry may not exist.
          </AlertDescription>
        </Alert>
      </RequireAdmin>
    );
  }

  return (
    <RequireAdmin pageTitle="Allah Name Details" backHref="/admin/allah-names">
      <div className="space-y-6">
        <PageHeader
          title={allahName.transliteration}
          description={allahName.meaning}
          backHref="/admin/allah-names"
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href={`/admin/allah-names/${id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              {allahName.isActive && (
                <Button variant="outline" onClick={() => setShowDeactivateDialog(true)}>
                  <Ban className="mr-2 h-4 w-4" />
                  Deactivate
                </Button>
              )}
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
              <CardTitle>Name Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Transliteration</p>
                <p className="text-lg font-semibold">{allahName.transliteration}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Arabic</p>
                <p className="text-2xl font-arabic" dir="rtl" lang="ar">
                  {allahName.arabic}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Meaning</p>
                <p className="text-lg">{allahName.meaning}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge variant={allahName.isActive ? 'default' : 'secondary'}>
                  {allahName.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Introduction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{allahName.intro}</p>
            </CardContent>
          </Card>
        </div>

        {allahName.quranicReferences && allahName.quranicReferences.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                Quranic References ({allahName.quranicReferences.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {allahName.quranicReferences.map((ref, index) => (
                <div key={index} className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Book className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{ref.surah}</span>
                    <Badge variant="outline">{ref.number}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground italic">"{ref.verse}"</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="font-mono text-sm">{allahName._id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{formatDateTime(allahName.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Updated</p>
                <p className="font-medium">{formatDateTime(allahName.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <ConfirmDialog
          open={showDeactivateDialog}
          onOpenChange={setShowDeactivateDialog}
          title="Deactivate Allah Name"
          description={`Are you sure you want to deactivate "${allahName.transliteration}"? This will hide it from users but you can reactivate it later.`}
          confirmText="Deactivate"
          onConfirm={handleDeactivate}
          isDestructive={false}
          isLoading={deactivateAllahName.isPending}
        />

        <ConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title="Delete Allah Name Permanently"
          description={`Are you sure you want to permanently delete "${allahName.transliteration}"? This action cannot be undone.`}
          confirmText="Delete Permanently"
          onConfirm={handleDelete}
          isDestructive
          isLoading={deleteAllahName.isPending}
        />
      </div>
    </RequireAdmin>
  );
}
