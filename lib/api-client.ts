import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_URL, AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY, ROUTES } from './constants';
import { ApiError } from '@/types';
import { clearAllAppStorage } from './storage';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setTokens = (accessToken: string, refreshToken: string): void => {
  if (typeof window === 'undefined') return;
  // Store in localStorage
  localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  // Also store in cookies for middleware access
  document.cookie = `${AUTH_TOKEN_KEY}=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  document.cookie = `${REFRESH_TOKEN_KEY}=${refreshToken}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
};

export const clearTokens = (): void => {
  if (typeof window === 'undefined') return;
  // Clear from localStorage
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  // Clear cookies
  document.cookie = `${AUTH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        clearAllAppStorage();
        if (typeof window !== 'undefined') {
          window.location.href = ROUTES.LOGIN;
        }
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const tokens = response.data.tokens || response.data;
        const newAccessToken = tokens.accessToken || (tokens.access && tokens.access.token);
        const newRefreshToken = tokens.refreshToken || (tokens.refresh && tokens.refresh.token);

        setTokens(newAccessToken, newRefreshToken);

        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        clearTokens();
        clearAllAppStorage();
        if (typeof window !== 'undefined') {
          window.location.href = ROUTES.LOGIN;
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const responseData = error.response?.data as ApiError | undefined;
    const statusCode = error.response?.status;
    const serverMessage = responseData?.message;

    // Build a detailed error message for debugging
    let errorMessage: string;

    if (!error.response) {
      // Network error - no response received from server
      const errorCode = error.code || 'UNKNOWN';
      const requestUrl = error.config?.url || 'unknown endpoint';
      const requestMethod = error.config?.method?.toUpperCase() || 'UNKNOWN';

      if (error.code === 'ECONNABORTED') {
        errorMessage = `[TIMEOUT] Request timed out after ${error.config?.timeout || 30000}ms - ${requestMethod} ${requestUrl}`;
      } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        errorMessage = `[NETWORK_ERROR] Failed to connect to server - ${requestMethod} ${requestUrl}. Check CORS, SSL, or server availability.`;
      } else {
        errorMessage = `[${errorCode}] ${error.message || 'Request failed'} - ${requestMethod} ${requestUrl}`;
      }
    } else {
      // Server responded with an error status
      const requestUrl = error.config?.url || 'unknown endpoint';
      const requestMethod = error.config?.method?.toUpperCase() || 'UNKNOWN';

      if (serverMessage) {
        errorMessage = `[${statusCode}] ${serverMessage} - ${requestMethod} ${requestUrl}`;
      } else {
        errorMessage = `[${statusCode}] ${error.message || 'Server error'} - ${requestMethod} ${requestUrl}`;
      }
    }

    // Create an actual Error instance so that "error instanceof Error" checks work
    const apiError = new Error(errorMessage) as Error & {
      code?: string;
      errors?: Record<string, string[]>;
      statusCode?: number;
      requestUrl?: string;
      requestMethod?: string;
    };
    apiError.code = responseData?.code || error.code;
    apiError.errors = responseData?.errors;
    apiError.statusCode = statusCode || 0;
    apiError.requestUrl = error.config?.url;
    apiError.requestMethod = error.config?.method;

    return Promise.reject(apiError);
  }
);

export default apiClient;
