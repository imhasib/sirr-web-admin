'use client';

import { useState } from 'react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from 'lucide-react';

export interface DateRange {
  startDate: string;
  endDate: string;
}

interface DateRangeFilterProps {
  value?: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

type PresetValue = '7d' | '30d' | '90d' | 'custom';

export function DateRangeFilter({ value, onChange, className }: DateRangeFilterProps) {
  const [preset, setPreset] = useState<PresetValue>('7d');

  const handlePresetChange = (newPreset: PresetValue) => {
    setPreset(newPreset);

    const now = new Date();
    let startDate: Date;
    let endDate: Date = endOfDay(now);

    switch (newPreset) {
      case '7d':
        startDate = startOfDay(subDays(now, 7));
        break;
      case '30d':
        startDate = startOfDay(subDays(now, 30));
        break;
      case '90d':
        startDate = startOfDay(subDays(now, 90));
        break;
      default:
        return; // For custom, we'll need a date picker (future enhancement)
    }

    onChange({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  };

  return (
    <div className={className}>
      <Select value={preset} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[180px]">
          <Calendar className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Select date range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="90d">Last 90 days</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
