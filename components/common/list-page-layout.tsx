'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LucideIcon, Plus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from './data-table';
import { EmptyState } from './empty-state';
import { ROUTES } from '@/lib/constants';
import Link from 'next/link';

interface ListPageLayoutProps<TData> {
  // Header
  title: string;
  description: string;

  // Data
  data: TData[];
  columns: ColumnDef<TData, any>[];
  isLoading: boolean;

  // Search
  searchKey?: string;
  searchPlaceholder?: string;

  // Add button (optional)
  addButton?: {
    href: string;
    label: string;
  };

  // Empty state
  emptyState: {
    icon: LucideIcon;
    title: string;
    description: string;
  };

  // Row click handler
  onRowClick?: (row: TData) => void;

  // Optional alert banner
  alertBanner?: {
    icon?: LucideIcon;
    title: string;
    description: string;
    variant?: 'default' | 'destructive';
  };

  // Optional back button override
  backRoute?: string;
}

export function ListPageLayout<TData>({
  title,
  description,
  data,
  columns,
  isLoading,
  searchKey,
  searchPlaceholder = 'Search...',
  addButton,
  emptyState,
  onRowClick,
  alertBanner,
  backRoute = ROUTES.DASHBOARD,
}: ListPageLayoutProps<TData>) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header with back button and title */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(backRoute)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      {/* Optional alert banner */}
      {alertBanner && (
        <Alert variant={alertBanner.variant}>
          {alertBanner.icon && <alertBanner.icon className="h-4 w-4" />}
          <AlertTitle>{alertBanner.title}</AlertTitle>
          <AlertDescription>{alertBanner.description}</AlertDescription>
        </Alert>
      )}

      {/* Loading state */}
      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : data.length === 0 ? (
        /* Empty state */
        <EmptyState
          icon={emptyState.icon}
          title={emptyState.title}
          description={emptyState.description}
          action={
            addButton ? (
              <Button asChild>
                <Link href={addButton.href}>
                  <Plus className="mr-2 h-4 w-4" />
                  {addButton.label}
                </Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        /* Data table with toolbar */
        <Card>
          <CardContent className="pt-6">
            <DataTable
              columns={columns}
              data={data}
              searchKey={searchKey}
              searchPlaceholder={searchPlaceholder}
              onRowClick={onRowClick}
              toolbarLeft={
                <div className="text-sm font-medium text-muted-foreground">
                  Total: {data.length} {data.length === 1 ? 'item' : 'items'}
                </div>
              }
              toolbarRight={
                addButton ? (
                  <Button asChild size="sm">
                    <Link href={addButton.href}>
                      <Plus className="mr-2 h-4 w-4" />
                      {addButton.label}
                    </Link>
                  </Button>
                ) : undefined
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
