/**
 * Knowledge Service API
 * API methods for knowledge base, products, and search
 */

import { createApiClient } from './client';
import { API_ENDPOINTS, USE_MOCK_DATA } from './config';
import {
  mockKnowledgeItems,
  mockKnowledgeStats,
  createPaginatedResponse,
  filterKnowledgeItems,
  delay,
} from './mock-data';
import type {
  Product,
  ProductCreateInput,
  KnowledgeItem,
  KnowledgeCreateInput,
  KnowledgeFilters,
  SearchRequest,
  SearchResponse,
  KnowledgeStats,
  PaginatedResponse,
  PaginationParams,
} from './types';

// Create API client instance
const client = createApiClient(API_ENDPOINTS.knowledge.base);

// ============================================================================
// Products API
// ============================================================================

export const productsApi = {
  /**
   * List all products
   */
  list: async (params?: PaginationParams & { category?: string; is_active?: boolean }) => {
    return client.get<PaginatedResponse<Product>>(API_ENDPOINTS.knowledge.products, params as Record<string, unknown>);
  },

  /**
   * Get single product by ID
   */
  get: async (id: number) => {
    return client.get<Product>(`${API_ENDPOINTS.knowledge.products}/${id}`);
  },

  /**
   * Create new product
   */
  create: async (data: ProductCreateInput) => {
    return client.post<Product>(API_ENDPOINTS.knowledge.products, data);
  },

  /**
   * Update product
   */
  update: async (id: number, data: Partial<ProductCreateInput>) => {
    return client.put<Product>(`${API_ENDPOINTS.knowledge.products}/${id}`, data);
  },

  /**
   * Delete product (soft delete)
   */
  delete: async (id: number) => {
    return client.delete<void>(`${API_ENDPOINTS.knowledge.products}/${id}`);
  },
};

// ============================================================================
// Knowledge Items API
// ============================================================================

export const knowledgeApi = {
  /**
   * List knowledge items
   */
  list: async (params?: PaginationParams & KnowledgeFilters) => {
    // Use mock data if configured or if API fails
    if (USE_MOCK_DATA) {
      await delay();
      const filtered = filterKnowledgeItems(mockKnowledgeItems, {
        type: params?.types?.[0],
        status: params?.status?.[0],
        product_id: params?.product_ids?.[0],
        tags: params?.tags,
      });
      return createPaginatedResponse(filtered, params?.page, params?.page_size);
    }

    try {
      return await client.get<PaginatedResponse<KnowledgeItem>>(
        API_ENDPOINTS.knowledge.knowledge,
        params as Record<string, unknown>
      );
    } catch (error) {
      // Fallback to mock data on error
      console.warn('Knowledge API failed, using mock data:', error);
      await delay();
      const filtered = filterKnowledgeItems(mockKnowledgeItems, {
        type: params?.types?.[0],
        status: params?.status?.[0],
        product_id: params?.product_ids?.[0],
        tags: params?.tags,
      });
      return createPaginatedResponse(filtered, params?.page, params?.page_size);
    }
  },

  /**
   * Get single knowledge item
   */
  get: async (id: number, incrementView = true) => {
    return client.get<KnowledgeItem>(
      `${API_ENDPOINTS.knowledge.knowledge}/${id}`,
      { increment_view: incrementView }
    );
  },

  /**
   * Create knowledge item
   */
  create: async (data: KnowledgeCreateInput) => {
    return client.post<KnowledgeItem>(API_ENDPOINTS.knowledge.knowledge, data);
  },

  /**
   * Update knowledge item
   */
  update: async (id: number, data: Partial<KnowledgeCreateInput>) => {
    return client.put<KnowledgeItem>(
      `${API_ENDPOINTS.knowledge.knowledge}/${id}`,
      data
    );
  },

  /**
   * Delete knowledge item (archive)
   */
  delete: async (id: number) => {
    return client.delete<void>(`${API_ENDPOINTS.knowledge.knowledge}/${id}`);
  },

  /**
   * Like/unlike knowledge item
   */
  toggleLike: async (id: number, unlike = false) => {
    const endpoint = `${API_ENDPOINTS.knowledge.knowledge}/${id}/like${unlike ? '?unlike=true' : ''}`;
    return client.post<{ success: boolean; action: string }>(endpoint);
  },

  /**
   * Batch create knowledge items
   */
  batchCreate: async (items: KnowledgeCreateInput[]) => {
    return client.post<{
      success_count: number;
      failure_count: number;
      errors: Array<{ index: number; title: string; error: string }>;
    }>(`${API_ENDPOINTS.knowledge.knowledge}/batch`, { items });
  },
};

// ============================================================================
// Search API
// ============================================================================

export const searchApi = {
  /**
   * Search knowledge base
   */
  search: async (request: SearchRequest) => {
    return client.post<SearchResponse>(API_ENDPOINTS.knowledge.search, request);
  },

  /**
   * RAG query (Retrieval-Augmented Generation)
   */
  rag: async (query: string, contextLength = 5) => {
    return client.post<{
      query: string;
      answer: string;
      sources: SearchResponse['results'];
      confidence: number;
      model_used: string;
    }>(`${API_ENDPOINTS.knowledge.search}/rag`, {
      query,
      context_length: contextLength,
    });
  },
};

// ============================================================================
// Statistics API
// ============================================================================

export const statsApi = {
  /**
   * Get knowledge base statistics
   */
  get: async () => {
    // Use mock data if configured or if API fails
    if (USE_MOCK_DATA) {
      await delay();
      return mockKnowledgeStats;
    }

    try {
      return await client.get<KnowledgeStats>(API_ENDPOINTS.knowledge.stats);
    } catch (error) {
      // Fallback to mock data on error
      console.warn('Stats API failed, using mock data:', error);
      await delay();
      return mockKnowledgeStats;
    }
  },
};

// ============================================================================
// Combined Export
// ============================================================================

export const knowledgeService = {
  products: productsApi,
  knowledge: knowledgeApi,
  search: searchApi,
  stats: statsApi,
};

export default knowledgeService;
