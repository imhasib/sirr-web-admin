'use client';

import { ColumnDef } from '@tanstack/react-table';
import { AllahName } from '@/types';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export const createColumns = (): ColumnDef<AllahName>[] => [
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
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/allah-names/${name._id}/edit`}>
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
      );
    },
  },
];
