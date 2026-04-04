'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Activity, AlertTriangle, Clock, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RequireAdmin } from '@/components/auth';
import {
  MetricCard,
  LineChart,
  PieChart,
  DateRangeFilter,
  DateRange,
} from '@/components/metrics';
import { useSoulMirrorLatency, useSoulMirrorErrors } from '@/hooks/use-metrics';
import { ROUTES } from '@/lib/constants';
import { format } from 'date-fns';

export default function SoulMirrorMetricsPage() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const {
    data: latencyMetrics,
    isLoading: isLoadingLatency,
    error: latencyError,
  } = useSoulMirrorLatency({
    startDate: dateRange?.startDate,
    endDate: dateRange?.endDate,
  });

  const {
    data: errorMetrics,
    isLoading: isLoadingErrors,
    error: errorsError,
  } = useSoulMirrorErrors({
    startDate: dateRange?.startDate,
    endDate: dateRange?.endDate,
  });

  if (latencyError || errorsError) {
    return (
      <RequireAdmin
        pageTitle="Soul Mirror Performance"
        pageDescription="Monitor Soul Mirror generation performance and errors"
      >
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load metrics data. Please try again later.
          </AlertDescription>
        </Alert>
      </RequireAdmin>
    );
  }

  return (
    <RequireAdmin
      pageTitle="Soul Mirror Performance"
      pageDescription="Monitor Soul Mirror generation performance and errors"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.DASHBOARD)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Soul Mirror Performance</h1>
              <p className="text-muted-foreground">
                Monitor generation latency and error rates
              </p>
            </div>
          </div>
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
        </div>

        {/* Latency Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="P50 Latency"
            value={latencyMetrics ? `${latencyMetrics.latency.p50}ms` : '-'}
            subtitle="Median response time"
            icon={Clock}
            isLoading={isLoadingLatency}
          />
          <MetricCard
            title="P95 Latency"
            value={latencyMetrics ? `${latencyMetrics.latency.p95}ms` : '-'}
            subtitle="95th percentile"
            icon={Activity}
            isLoading={isLoadingLatency}
          />
          <MetricCard
            title="Total Generations"
            value={latencyMetrics?.totalGenerations.toLocaleString() || '-'}
            subtitle={
              latencyMetrics?.period
                ? `${format(new Date(latencyMetrics.period.startDate), 'MMM d')} - ${format(new Date(latencyMetrics.period.endDate), 'MMM d')}`
                : ''
            }
            icon={TrendingDown}
            isLoading={isLoadingLatency}
          />
          <MetricCard
            title="Slow Generations"
            value={latencyMetrics?.slowGenerations || '-'}
            subtitle="> 5 seconds"
            icon={AlertTriangle}
            trend={
              latencyMetrics && latencyMetrics.slowGenerations > 0 ? 'up' : 'neutral'
            }
            isLoading={isLoadingLatency}
          />
        </div>

        {/* Latency Charts */}
        {latencyMetrics?.byTimeOfDay && latencyMetrics.byTimeOfDay.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-1">
            <LineChart
              title="Latency Distribution Over Time"
              description="P50, P95, and P99 latency metrics by hour"
              labels={
                latencyMetrics.byTimeOfDay.map((item) =>
                  `${item.hour.toString().padStart(2, '0')}:00`
                )
              }
              datasets={[
                {
                  label: 'Avg Latency (ms)',
                  data: latencyMetrics.byTimeOfDay.map((item) => item.avgLatency),
                  borderColor: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  fill: true,
                },
              ]}
              yAxisLabel="Latency (ms)"
              xAxisLabel="Hour of Day"
              isLoading={isLoadingLatency}
            />
          </div>
        )}

        {/* Error Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            title="Total Attempts"
            value={errorMetrics?.overall.totalAttempts.toLocaleString() || '-'}
            subtitle="All generation attempts"
            icon={Activity}
            isLoading={isLoadingErrors}
          />
          <MetricCard
            title="Failures"
            value={errorMetrics?.overall.failures || '-'}
            subtitle="Failed generations"
            icon={AlertTriangle}
            trend={errorMetrics && errorMetrics.overall.failures > 0 ? 'up' : 'neutral'}
            isLoading={isLoadingErrors}
          />
          <MetricCard
            title="Error Rate"
            value={errorMetrics ? `${errorMetrics.overall.errorRate.toFixed(2)}%` : '-'}
            subtitle="Failure percentage"
            icon={TrendingDown}
            trend={
              errorMetrics
                ? errorMetrics.overall.errorRate > 5
                  ? 'up'
                  : errorMetrics.overall.errorRate > 2
                  ? 'neutral'
                  : 'down'
                : undefined
            }
            trendValue={
              errorMetrics && errorMetrics.overall.errorRate > 5
                ? 'High error rate'
                : undefined
            }
            isLoading={isLoadingErrors}
          />
        </div>

        {/* Error Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <PieChart
            title="Error Types Breakdown"
            description="Distribution of errors by type"
            labels={errorMetrics?.byErrorType.map((item) => item.errorType) || []}
            data={errorMetrics?.byErrorType.map((item) => item.count) || []}
            isLoading={isLoadingErrors}
          />
          <LineChart
            title="Error Rate Trend"
            description="Error rate over time"
            labels={
              errorMetrics?.errorTrend.map((item) =>
                format(new Date(item.date), 'MMM d')
              ) || []
            }
            datasets={[
              {
                label: 'Error Rate (%)',
                data: errorMetrics?.errorTrend.map((item) => item.errorRate) || [],
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
              },
            ]}
            yAxisLabel="Error Rate (%)"
            xAxisLabel="Date"
            isLoading={isLoadingErrors}
          />
        </div>
      </div>
    </RequireAdmin>
  );
}
