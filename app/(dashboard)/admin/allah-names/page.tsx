'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Book, ArrowLeft, Info } from 'lucide-react';
import { useAllahNames } from '@/hooks/use-allah-names';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable, PageHeader, EmptyState } from '@/components/common';
import { RequireAdmin } from '@/components/auth';
import { createColumns } from './columns';
import { ROUTES } from '@/lib/constants';

export default function AllahNamesPage() {
  const router = useRouter();

  const { data, isLoading, error } = useAllahNames({
    limit: 100,
  });

  const allahNames = data || [];

  const columns = useMemo(() => createColumns(), []);

  if (error) {
    return (
      <RequireAdmin
        pageTitle="Allah's 99 Names"
        pageDescription="View and manage Allah's 99 Beautiful Names"
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
      pageTitle="Allah's 99 Names"
      pageDescription="View and manage Allah's 99 Beautiful Names"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.DASHBOARD)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <PageHeader
            title="Allah's 99 Names"
            description="View and manage Allah's 99 Beautiful Names with Quranic references"
          />
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Sacred Constants</AlertTitle>
          <AlertDescription>
            The 99 names of Allah are sacred constants. You can edit existing names to fix typos or improve descriptions, but cannot create new names or delete existing ones.
          </AlertDescription>
        </Alert>

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
            title="No Allah names found"
            description="The 99 names of Allah should be present in the database."
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Total: {allahNames.length} names</CardTitle>
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
      </div>
    </RequireAdmin>
  );
}
