import apiClient from '@/lib/api-client';
import {
  SoulMirrorLatencyResponse,
  SoulMirrorLatencyParams,
  SoulMirrorErrorsResponse,
  SoulMirrorErrorsParams,
} from '@/types';

const METRICS_BASE_URL = '/admin/metrics';

export const metricsService = {
  // AI Reflection - Performance (includes latency metrics)
  async getSoulMirrorLatency(
    params?: SoulMirrorLatencyParams
  ): Promise<SoulMirrorLatencyResponse> {
    const response = await apiClient.get<SoulMirrorLatencyResponse>(
      `${METRICS_BASE_URL}/ai-reflection/performance`,
      { params }
    );
    return response.data;
  },

  // AI Reflection - Errors
  async getSoulMirrorErrors(
    params?: SoulMirrorErrorsParams
  ): Promise<SoulMirrorErrorsResponse> {
    const response = await apiClient.get<SoulMirrorErrorsResponse>(
      `${METRICS_BASE_URL}/ai-reflection/errors`,
      { params }
    );
    return response.data;
  },
};

export default metricsService;
