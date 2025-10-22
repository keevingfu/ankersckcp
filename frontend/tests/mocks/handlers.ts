/**
 * MSW Request Handlers
 * Mock API responses for E2E tests
 *
 * Installation:
 * npm install -D msw@latest
 */

import { http, HttpResponse } from 'msw';

// Mock API base URL
const API_BASE = 'http://localhost:8000/api/v1';

/**
 * Knowledge API Handlers
 */
export const knowledgeHandlers = [
  // GET /api/v1/knowledge/items
  http.get(`${API_BASE}/knowledge/items`, () => {
    return HttpResponse.json({
      items: [
        {
          id: 1,
          title: 'How to connect Bluetooth headphones',
          content: 'Step-by-step guide...',
          type: 'FAQ',
          language: 'EN',
          quality_score: 95.5,
          tags: ['bluetooth', 'connectivity'],
          created_at: '2025-10-22T10:30:00Z',
        },
        {
          id: 2,
          title: 'Noise Cancellation Technology',
          content: 'Learn about ANC...',
          type: 'GUIDE',
          language: 'EN',
          quality_score: 92.3,
          tags: ['noise-cancellation', 'technology'],
          created_at: '2025-10-22T11:00:00Z',
        },
      ],
      total: 2,
      page: 1,
      page_size: 20,
    });
  }),

  // GET /api/v1/knowledge/items/:id
  http.get(`${API_BASE}/knowledge/items/:id`, ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      id: Number(id),
      title: 'Sample Knowledge Item',
      content: 'This is a sample knowledge item for testing.',
      type: 'FAQ',
      language: 'EN',
      quality_score: 95.0,
      tags: ['test'],
      created_at: '2025-10-22T10:00:00Z',
    });
  }),

  // POST /api/v1/knowledge/search
  http.post(`${API_BASE}/knowledge/search`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      results: [
        {
          id: 1,
          title: `Search result for: ${body.query}`,
          content: 'Matching content...',
          relevance_score: 0.95,
        },
      ],
      total: 1,
    });
  }),
];

/**
 * Content Generation API Handlers
 */
export const contentHandlers = [
  // POST /api/v1/content/generate
  http.post(`${API_BASE}/content/generate`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      id: 'gen_12345',
      content: `Generated ${body.type} content about ${body.topic}`,
      title: body.topic,
      type: body.type,
      status: 'completed',
      created_at: new Date().toISOString(),
    });
  }),
];

/**
 * Chat API Handlers
 */
export const chatHandlers = [
  // POST /api/v1/chat/message
  http.post(`${API_BASE}/chat/message`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      id: 'msg_12345',
      message: `Response to: ${body.message}`,
      role: 'assistant',
      timestamp: new Date().toISOString(),
    });
  }),
];

/**
 * Analytics API Handlers
 */
export const analyticsHandlers = [
  // GET /api/v1/analytics/overview
  http.get(`${API_BASE}/analytics/overview`, () => {
    return HttpResponse.json({
      total_knowledge_items: 1234,
      total_content: 456,
      total_conversations: 789,
      average_quality_score: 92.5,
    });
  }),
];

/**
 * All handlers combined
 */
export const handlers = [
  ...knowledgeHandlers,
  ...contentHandlers,
  ...chatHandlers,
  ...analyticsHandlers,
];
