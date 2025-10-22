/**
 * SWR Configuration
 * Global configuration for SWR data fetching and caching
 */

import type { SWRConfiguration } from 'swr';

/**
 * Default SWR configuration
 */
export const swrConfig: SWRConfiguration = {
  // Revalidation settings
  revalidateOnFocus: true, // Revalidate when window gains focus
  revalidateOnReconnect: true, // Revalidate when network reconnects
  revalidateIfStale: true, // Revalidate if data is stale

  // Cache settings
  dedupingInterval: 2000, // Dedupe requests within 2 seconds

  // Retry settings
  shouldRetryOnError: true,
  errorRetryCount: 3,
  errorRetryInterval: 5000, // 5 seconds

  // Performance settings
  focusThrottleInterval: 5000, // Throttle focus revalidation to 5s

  // Success/Error behavior
  keepPreviousData: true, // Keep previous data while revalidating

  // Default fetcher (can be overridden per-hook)
  fetcher: (url: string) => fetch(url).then(res => res.json()),
};

/**
 * SWR configuration for real-time data (chat, analytics)
 */
export const realtimeConfig: SWRConfiguration = {
  ...swrConfig,
  refreshInterval: 3000, // Auto-refresh every 3 seconds
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

/**
 * SWR configuration for static data (knowledge base, products)
 */
export const staticConfig: SWRConfiguration = {
  ...swrConfig,
  refreshInterval: 0, // No auto-refresh
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 60000, // Dedupe for 1 minute
};

/**
 * SWR configuration for analytics data
 */
export const analyticsConfig: SWRConfiguration = {
  ...swrConfig,
  refreshInterval: 30000, // Auto-refresh every 30 seconds
  dedupingInterval: 10000, // Dedupe for 10 seconds
};
