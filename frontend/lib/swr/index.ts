/**
 * SWR Module
 * Exports SWR configuration, provider, and hooks
 */

export { SWRProvider } from './SWRProvider';
export { swrConfig, realtimeConfig, staticConfig, analyticsConfig } from './config';
export {
  // Knowledge hooks
  useKnowledgeItems,
  useKnowledgeItem,
  useKnowledgeStats,
  useProducts,
  useProduct,
  useSearch,
  // Analytics hooks
  useAnalyticsOverview,
  useUserMetrics,
  useContentMetrics,
  useSearchMetrics,
  // Mutation helpers
  createKnowledgeItem,
  updateKnowledgeItem,
  deleteKnowledgeItem,
} from './hooks';
