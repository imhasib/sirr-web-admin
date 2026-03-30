'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Pencil, Trash2, User, Briefcase, Tag, Calendar } from 'lucide-react';
import { useTherapist, useDeleteTherapist } from '@/hooks/use-therapists';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader, ConfirmDialog } from '@/components/common';
import { RequireAdmin } from '@/components/auth';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';

export default function TherapistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, isLoading, error } = useTherapist(id);
  const deleteTherapist = useDeleteTherapist();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const therapist = data?.data;

  const handleDelete = async () => {
    await deleteTherapist.mutateAsync(id);
    router.push('/admin/therapists');
  };

  if (isLoading) {
    return (
      <RequireAdmin
        pageTitle="Therapist Details"
        backHref="/admin/therapists"
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

  if (error || !therapist) {
    return (
      <RequireAdmin
        pageTitle="Therapist Details"
        backHref="/admin/therapists"
      >
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load therapist details. The profile may not exist.
          </AlertDescription>
        </Alert>
      </RequireAdmin>
    );
  }

  return (
    <RequireAdmin
      pageTitle="Therapist Details"
      backHref="/admin/therapists"
    >
    <div className="space-y-6">
      <PageHeader
        title={therapist.name}
        description="Therapist profile details"
        backHref="/admin/therapists"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href={`/admin/therapists/${id}/edit`}>
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
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={therapist.photo} alt={therapist.name} />
                <AvatarFallback className="text-xl">
                  {therapist.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{therapist.name}</h3>
                {therapist.title && (
                  <p className="text-muted-foreground">{therapist.title}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                {therapist.gender ? (
                  <Badge variant="secondary" className="capitalize">
                    {therapist.gender}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">Not specified</span>
                )}
              </div>
            </div>

            {therapist.tags && therapist.tags.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Tag className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Specializations</p>
                  <div className="flex flex-wrap gap-2">
                    {therapist.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            {therapist.description ? (
              <p className="text-muted-foreground whitespace-pre-wrap">
                {therapist.description}
              </p>
            ) : (
              <p className="text-muted-foreground italic">No description provided</p>
            )}
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
                <p className="font-mono text-sm">{therapist._id}</p>
              </div>
              {therapist.userId && (
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-mono text-sm">{therapist.userId}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{formatDateTime(therapist.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Updated</p>
                <p className="font-medium">{formatDateTime(therapist.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Therapist"
        description={`Are you sure you want to delete "${therapist.name}"? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={handleDelete}
          isDestructive
          isLoading={deleteTherapist.isPending}
        />
      </div>
    </RequireAdmin>
  );
}
