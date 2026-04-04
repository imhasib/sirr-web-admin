// Common types
export interface DatePeriod {
  startDate: string;
  endDate: string;
}

export type Platform = 'ios' | 'android' | 'all';

export interface MetricsQueryParams {
  startDate?: string;
  endDate?: string;
  platform?: Platform;
}

// Soul Mirror - Performance/Latency
export interface LatencyMetrics {
  p50: number;
  p95: number;
  p99: number;
  avg: number;
  min: number;
  max: number;
}

export interface TimeOfDayLatency {
  hour: number;
  avgLatency: number;
  count: number;
}

export interface SoulMirrorLatencyResponse {
  period: DatePeriod;
  latency: LatencyMetrics;
  totalGenerations: number;
  slowGenerations: number;
  byTimeOfDay?: TimeOfDayLatency[]; // Optional: Not yet implemented in backend
}

export interface SoulMirrorLatencyParams extends MetricsQueryParams {
  userId?: string;
}

// Soul Mirror - Errors
export interface ErrorType {
  errorType: string;
  count: number;
  percentage: number;
  avgLatency?: number;
}

export interface ErrorTrend {
  date: string;
  errorRate: number;
}

export interface SoulMirrorErrorsResponse {
  period: DatePeriod;
  overall: {
    totalAttempts: number;
    failures: number;
    errorRate: number;
  };
  byErrorType: ErrorType[];
  errorTrend: ErrorTrend[];
}

export interface SoulMirrorErrorsParams extends MetricsQueryParams {
  userId?: string;
}
