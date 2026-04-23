'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Feedback } from '@/types';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export const feedbackColumns: ColumnDef<Feedback>[] = [
  {
    accessorKey: 'name',
    header: 'User',
    cell: ({ row }) => {
      const feedback = row.original;
      return (
        <div>
          <p className="font-medium">{feedback.name}</p>
          <p className="text-sm text-muted-foreground">{feedback.email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'message',
    header: 'Feedback',
    cell: ({ row }) => {
      const message = row.getValue('message') as string;
      return (
        <p className="text-sm break-words max-w-[480px] line-clamp-2">
          {message}
        </p>
      );
    },
  },
  {
    accessorKey: 'screenName',
    header: 'Screen',
    cell: ({ row }) => {
      const screen = row.getValue('screenName') as string | undefined;
      if (!screen) return <span className="text-muted-foreground">-</span>;
      return (
        <Badge variant="outline" className="font-mono text-xs">
          {screen}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Submitted',
    cell: ({ row }) => formatDate(row.getValue('createdAt')),
  },
];
