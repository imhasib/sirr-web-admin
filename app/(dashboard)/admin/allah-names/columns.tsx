'use client';

import { ColumnDef } from '@tanstack/react-table';
import { AllahName } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Ban } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface ColumnOptions {
  onDeactivate: (name: AllahName) => void;
  onDelete: (name: AllahName) => void;
}

export const createColumns = ({
  onDeactivate,
  onDelete,
}: ColumnOptions): ColumnDef<AllahName>[] => [
  {
    accessorKey: 'transliteration',
    header: 'Transliteration',
    cell: ({ row }) => <span className="font-medium">{row.getValue('transliteration')}</span>,
  },
  {
    accessorKey: 'arabic',
    header: 'Arabic',
    cell: ({ row }) => (
      <span className="font-arabic text-lg" dir="rtl" lang="ar">
        {row.getValue('arabic')}
      </span>
    ),
  },
  {
    accessorKey: 'meaning',
    header: 'Meaning',
    cell: ({ row }) => <span className="text-muted-foreground">{row.getValue('meaning')}</span>,
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean;
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => formatDate(row.getValue('createdAt')),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const name = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/allah-names/${name._id}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          {name.isActive && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDeactivate(name);
              }}
              title="Deactivate"
            >
              <Ban className="h-4 w-4 text-orange-500" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(name);
            }}
            title="Delete permanently"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      );
    },
  },
];
