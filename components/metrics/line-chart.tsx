'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Dataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  fill?: boolean;
}

interface LineChartProps {
  title: string;
  description?: string;
  labels: string[];
  datasets: Dataset[];
  isLoading?: boolean;
  height?: number;
  yAxisLabel?: string;
  xAxisLabel?: string;
}

export function LineChart({
  title,
  description,
  labels,
  datasets,
  isLoading,
  height = 300,
  yAxisLabel,
  xAxisLabel,
}: LineChartProps) {
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        title: yAxisLabel
          ? {
              display: true,
              text: yAxisLabel,
            }
          : undefined,
      },
      x: {
        grid: {
          display: false,
        },
        title: xAxisLabel
          ? {
              display: true,
              text: xAxisLabel,
            }
          : undefined,
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  const chartData = {
    labels,
    datasets: datasets.map((dataset, index) => ({
      ...dataset,
      borderColor: dataset.borderColor || `hsl(${index * 60}, 70%, 50%)`,
      backgroundColor: dataset.backgroundColor || `hsla(${index * 60}, 70%, 50%, 0.1)`,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 5,
    })),
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[200px] mb-2" />
          {description && <Skeleton className="h-4 w-[300px]" />}
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full" style={{ height }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          <Line options={options} data={chartData} />
        </div>
      </CardContent>
    </Card>
  );
}
