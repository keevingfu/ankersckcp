/**
 * Content Service API
 * API methods for AI content generation
 */

import { createApiClient } from './client';
import { API_ENDPOINTS } from './config';
import type { ContentTemplate, ContentGenerateRequest } from './types';

// Create API client instance
const client = createApiClient(API_ENDPOINTS.content.base);

// ============================================================================
// Content Generation API
// ============================================================================

export const contentApi = {
  /**
   * Generate content
   */
  generate: async (request: ContentGenerateRequest) => {
    return client.post<{
      content: string;
      metadata: {
        word_count: number;
        reading_time: number;
        seo_score?: number;
      };
    }>(API_ENDPOINTS.content.generate, request);
  },

  /**
   * List available templates
   */
  listTemplates: async () => {
    return client.get<{ templates: ContentTemplate[] }>(
      API_ENDPOINTS.content.templates
    );
  },

  /**
   * Get content history
   */
  getHistory: async (page = 1, pageSize = 20) => {
    return client.get<{
      history: Array<{
        id: string;
        title: string;
        type: string;
        created_at: string;
      }>;
      total: number;
    }>(API_ENDPOINTS.content.history, { page, page_size: pageSize });
  },
};

export default contentApi;
