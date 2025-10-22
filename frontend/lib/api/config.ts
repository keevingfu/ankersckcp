/**
 * API Configuration
 * Centralized API endpoint configuration
 */

// Mock Data Configuration
export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

// API Base URLs
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

export const API_ENDPOINTS = {
  // Knowledge Service (8001)
  knowledge: {
    base: `${API_BASE_URL}/api/v1`,
    products: '/products/',
    knowledge: '/knowledge/',
    search: '/search/',
    stats: '/stats/',
  },

  // Content Service (8002)
  content: {
    base: 'http://localhost:8002/api/v1',
    generate: '/content/generate/',
    templates: '/content/templates/',
    history: '/content/history/',
  },

  // Support Service (8003)
  support: {
    base: 'http://localhost:8003/api/v1',
    chat: '/support/chat/',
    conversations: '/support/conversations/',
    tickets: '/support/tickets/',
  },

  // Analytics Service (8004)
  analytics: {
    base: 'http://localhost:8004/api/v1',
    overview: '/analytics/overview/',
    users: '/analytics/users/',
    content: '/analytics/content/',
    search: '/analytics/search/',
  },

  // Auth Service (8005)
  auth: {
    base: 'http://localhost:8005/api/v1',
    login: '/auth/login/',
    register: '/auth/register/',
    refresh: '/auth/refresh/',
    verify: '/auth/verify/',
    me: '/users/me/',
  },
};

// API Configuration
export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
};

// Health check endpoints
export const HEALTH_ENDPOINTS = {
  knowledge: 'http://localhost:8001/health',
  content: 'http://localhost:8002/health',
  support: 'http://localhost:8003/health',
  analytics: 'http://localhost:8004/health',
  auth: 'http://localhost:8005/health',
};
