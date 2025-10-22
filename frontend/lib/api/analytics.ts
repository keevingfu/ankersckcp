/**
 * Analytics Service API
 * API methods for analytics and metrics
 */

import { createApiClient } from './client';
import { API_ENDPOINTS, USE_MOCK_DATA } from './config';
import {
  mockAnalyticsOverview,
  mockUserMetrics,
  mockContentMetrics,
  mockSearchMetrics,
  delay,
} from './mock-data';
import type {
  AnalyticsOverview,
  UserMetrics,
  ContentMetrics,
  SearchMetrics,
} from './types';

// Create API client instance
const client = createApiClient(API_ENDPOINTS.analytics.base);

// ============================================================================
// Analytics API
// ============================================================================

export const analyticsApi = {
  /**
   * Get analytics overview
   */
  getOverview: async () => {
    if (USE_MOCK_DATA) {
      await delay();
      return mockAnalyticsOverview;
    }

    try {
      return await client.get<AnalyticsOverview>(API_ENDPOINTS.analytics.overview);
    } catch (error) {
      console.warn('Analytics Overview API failed, using mock data:', error);
      await delay();
      return mockAnalyticsOverview;
    }
  },

  /**
   * Get user metrics
   */
  getUserMetrics: async () => {
    if (USE_MOCK_DATA) {
      await delay();
      return mockUserMetrics;
    }

    try {
      return await client.get<UserMetrics>(API_ENDPOINTS.analytics.users);
    } catch (error) {
      console.warn('User Metrics API failed, using mock data:', error);
      await delay();
      return mockUserMetrics;
    }
  },

  /**
   * Get content metrics
   */
  getContentMetrics: async () => {
    if (USE_MOCK_DATA) {
      await delay();
      return mockContentMetrics;
    }

    try {
      return await client.get<ContentMetrics>(API_ENDPOINTS.analytics.content);
    } catch (error) {
      console.warn('Content Metrics API failed, using mock data:', error);
      await delay();
      return mockContentMetrics;
    }
  },

  /**
   * Get search metrics
   */
  getSearchMetrics: async () => {
    if (USE_MOCK_DATA) {
      await delay();
      return mockSearchMetrics;
    }

    try {
      return await client.get<SearchMetrics>(API_ENDPOINTS.analytics.search);
    } catch (error) {
      console.warn('Search Metrics API failed, using mock data:', error);
      await delay();
      return mockSearchMetrics;
    }
  },
};

export default analyticsApi;
