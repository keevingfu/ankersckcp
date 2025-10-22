/**
 * API Module - Main Export
 * Centralized export for all API services
 */

// Export configuration
export { API_ENDPOINTS, HEALTH_ENDPOINTS } from './config';

// Export types
export type * from './types';

// Export client utilities
export { createApiClient, isApiError, getErrorMessage } from './client';

// Export service APIs
export { knowledgeService, productsApi, knowledgeApi, searchApi, statsApi } from './knowledge';
export { default as analyticsApi } from './analytics';
export { default as contentApi } from './content';
export { default as supportApi } from './support';

// ============================================================================
// Unified API Object
// ============================================================================

import knowledgeService from './knowledge';
import analyticsApi from './analytics';
import contentApi from './content';
import supportApi from './support';

export const api = {
  // Knowledge Service (8001)
  knowledge: knowledgeService,

  // Analytics Service (8004)
  analytics: analyticsApi,

  // Content Service (8002)
  content: contentApi,

  // Support Service (8003)
  support: supportApi,
};

export default api;
