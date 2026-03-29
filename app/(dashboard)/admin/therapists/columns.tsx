'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Therapist } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface ColumnOptions {
  onDelete: (therapist: Therapist) => void;
}

export const createColumns = ({ onDelete }: ColumnOptions): ColumnDef<Therapist>[] => [
  {
    accessorKey: 'name',
    header: 'Therapist',
    cell: ({ row }) => {
      const therapist = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={therapist.photo} alt={therapist.name} />
            <AvatarFallback>
              {therapist.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{therapist.name}</p>
            {therapist.title && (
              <p className="text-sm text-muted-foreground">{therapist.title}</p>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    cell: ({ row }) => {
      const gender = row.getValue('gender') as string | undefined;
      if (!gender) return <span className="text-muted-foreground">-</span>;
      return (
        <Badge variant="secondary" className="capitalize">
          {gender}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'tags',
    header: 'Specializations',
    cell: ({ row }) => {
      const tags = row.getValue('tags') as string[] | undefined;
      if (!tags || tags.length === 0) {
        return <span className="text-muted-foreground">-</span>;
      }
      return (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 3}
            </Badge>
          )}
        </div>
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
      const therapist = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/therapists/${therapist._id}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(therapist);
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      );
    },
  },
];
