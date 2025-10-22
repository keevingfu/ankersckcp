/**
 * Support Service API
 * API methods for customer support and chatbot
 */

import { createApiClient } from './client';
import { API_ENDPOINTS } from './config';
import type { ChatRequest, ChatResponse, Conversation } from './types';

// Create API client instance
const client = createApiClient(API_ENDPOINTS.support.base);

// ============================================================================
// Support API
// ============================================================================

export const supportApi = {
  /**
   * Send chat message
   */
  chat: async (request: ChatRequest) => {
    return client.post<ChatResponse>(API_ENDPOINTS.support.chat, request);
  },

  /**
   * List conversations
   */
  listConversations: async (page = 1, pageSize = 20) => {
    return client.get<{ conversations: Conversation[]; total: number }>(
      API_ENDPOINTS.support.conversations,
      { page, page_size: pageSize }
    );
  },

  /**
   * Get conversation by ID
   */
  getConversation: async (id: string) => {
    return client.get<Conversation>(
      `${API_ENDPOINTS.support.conversations}/${id}`
    );
  },

  /**
   * List support tickets
   */
  listTickets: async (page = 1, pageSize = 20) => {
    return client.get<{
      tickets: Array<{
        id: string;
        title: string;
        status: string;
        priority: string;
        created_at: string;
      }>;
      total: number;
    }>(API_ENDPOINTS.support.tickets, { page, page_size: pageSize });
  },
};

export default supportApi;
