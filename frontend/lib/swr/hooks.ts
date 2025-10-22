/**
 * SWR Hooks
 * Custom hooks for data fetching with SWR
 */

import useSWR from 'swr';
import type { SWRConfiguration } from 'swr';
import { knowledgeService } from '@/lib/api/knowledge';
import { staticConfig, realtimeConfig, analyticsConfig } from './config';
import type {
  KnowledgeItem,
  Product,
  KnowledgeStats,
  PaginatedResponse,
  PaginationParams,
  KnowledgeFilters,
} from '@/lib/api/types';

// ============================================================================
// Knowledge API Hooks
// ============================================================================

/**
 * Hook to fetch knowledge items with pagination and filters
 */
export function useKnowledgeItems(
  params?: PaginationParams & KnowledgeFilters,
  config?: SWRConfiguration
) {
  const key = params ? ['knowledge-items', params] : null;

  return useSWR<PaginatedResponse<KnowledgeItem>>(
    key,
    () => knowledgeService.knowledge.list(params),
    { ...staticConfig, ...config }
  );
}

/**
 * Hook to fetch single knowledge item
 */
export function useKnowledgeItem(
  id: number | null,
  incrementView = true,
  config?: SWRConfiguration
) {
  return useSWR<KnowledgeItem>(
    id ? ['knowledge-item', id, incrementView] : null,
    id ? () => knowledgeService.knowledge.get(id, incrementView) : null,
    { ...staticConfig, ...config }
  );
}

/**
 * Hook to fetch knowledge base statistics
 */
export function useKnowledgeStats(config?: SWRConfiguration) {
  return useSWR<KnowledgeStats>(
    'knowledge-stats',
    () => knowledgeService.stats.get(),
    { ...analyticsConfig, ...config }
  );
}

/**
 * Hook to fetch products
 */
export function useProducts(
  params?: PaginationParams & { category?: string; is_active?: boolean },
  config?: SWRConfiguration
) {
  const key = params ? ['products', params] : 'products';

  return useSWR<PaginatedResponse<Product>>(
    key,
    () => knowledgeService.products.list(params),
    { ...staticConfig, ...config }
  );
}

/**
 * Hook to fetch single product
 */
export function useProduct(
  id: number | null,
  config?: SWRConfiguration
) {
  return useSWR<Product>(
    id ? ['product', id] : null,
    id ? () => knowledgeService.products.get(id) : null,
    { ...staticConfig, ...config }
  );
}

// ============================================================================
// Search Hooks
// ============================================================================

/**
 * Hook for semantic search (disabled by default, use trigger)
 */
export function useSearch(
  query: string | null,
  config?: SWRConfiguration
) {
  return useSWR(
    query ? ['search', query] : null,
    query ? () => knowledgeService.search.search({ query }) : null,
    { ...realtimeConfig, ...config, revalidateOnMount: false }
  );
}

// ============================================================================
// Analytics Hooks
// ============================================================================

/**
 * Hook to fetch analytics overview
 */
export function useAnalyticsOverview(config?: SWRConfiguration) {
  // Using a dynamic import to avoid circular dependency
  return useSWR(
    'analytics-overview',
    async () => {
      const { api } = await import('@/lib/api');
      return api.analytics.getOverview();
    },
    { ...analyticsConfig, ...config }
  );
}

/**
 * Hook to fetch user metrics
 */
export function useUserMetrics(config?: SWRConfiguration) {
  return useSWR(
    'user-metrics',
    async () => {
      const { api } = await import('@/lib/api');
      return api.analytics.getUserMetrics();
    },
    { ...analyticsConfig, ...config }
  );
}

/**
 * Hook to fetch content metrics
 */
export function useContentMetrics(config?: SWRConfiguration) {
  return useSWR(
    'content-metrics',
    async () => {
      const { api } = await import('@/lib/api');
      return api.analytics.getContentMetrics();
    },
    { ...analyticsConfig, ...config }
  );
}

/**
 * Hook to fetch search metrics
 */
export function useSearchMetrics(config?: SWRConfiguration) {
  return useSWR(
    'search-metrics',
    async () => {
      const { api } = await import('@/lib/api');
      return api.analytics.getSearchMetrics();
    },
    { ...analyticsConfig, ...config }
  );
}

// ============================================================================
// Mutation Helpers
// ============================================================================

/**
 * Helper to create knowledge item with optimistic UI
 */
export async function createKnowledgeItem(
  data: Parameters<typeof knowledgeService.knowledge.create>[0]
) {
  return knowledgeService.knowledge.create(data);
}

/**
 * Helper to update knowledge item with optimistic UI
 */
export async function updateKnowledgeItem(
  id: number,
  data: Parameters<typeof knowledgeService.knowledge.update>[1]
) {
  return knowledgeService.knowledge.update(id, data);
}

/**
 * Helper to delete knowledge item
 */
export async function deleteKnowledgeItem(id: number) {
  return knowledgeService.knowledge.delete(id);
}
