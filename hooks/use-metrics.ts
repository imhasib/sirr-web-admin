'use client';

import { useQuery } from '@tanstack/react-query';
import { metricsService } from '@/services';
import {
  SoulMirrorLatencyParams,
  SoulMirrorErrorsParams,
} from '@/types';

// Query keys factory
export const metricsKeys = {
  all: ['metrics'] as const,
  soulMirror: () => [...metricsKeys.all, 'soul-mirror'] as const,
  soulMirrorLatency: (params?: SoulMirrorLatencyParams) =>
    [...metricsKeys.soulMirror(), 'latency', params] as const,
  soulMirrorErrors: (params?: SoulMirrorErrorsParams) =>
    [...metricsKeys.soulMirror(), 'errors', params] as const,
};

// Soul Mirror Hooks
export function useSoulMirrorLatency(params?: SoulMirrorLatencyParams) {
  return useQuery({
    queryKey: metricsKeys.soulMirrorLatency(params),
    queryFn: () => metricsService.getSoulMirrorLatency(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSoulMirrorErrors(params?: SoulMirrorErrorsParams) {
  return useQuery({
    queryKey: metricsKeys.soulMirrorErrors(params),
    queryFn: () => metricsService.getSoulMirrorErrors(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
