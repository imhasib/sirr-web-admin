'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Library } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface ColumnOptions {
  onDelete: (library: Library) => void;
}

export const createColumns = ({ onDelete }: ColumnOptions): ColumnDef<Library>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="max-w-[200px]">
        <p className="font-medium truncate">{row.getValue('name')}</p>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue('category')}</Badge>
    ),
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
  },
  {
    accessorKey: 'premium',
    header: 'Premium',
    cell: ({ row }) => (
      <Badge variant={row.getValue('premium') ? 'default' : 'outline'}>
        {row.getValue('premium') ? 'Premium' : 'Free'}
      </Badge>
    ),
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
      const library = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a href={library.link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/libraries/${library._id}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(library);
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      );
    },
  },
];
