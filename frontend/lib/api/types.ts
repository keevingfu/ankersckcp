/**
 * API Types
 * TypeScript type definitions for API requests and responses
 */

// ============================================================================
// Common Types
// ============================================================================

export interface PaginationParams {
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ApiError {
  error: string;
  message: string;
  path?: string;
  timestamp?: string;
}

// ============================================================================
// Product Types
// ============================================================================

export type ProductCategory = 'earbuds' | 'headphones' | 'speakers' | 'accessories';

export interface Product {
  id: number;
  sku: string;
  model: string;
  series?: string;
  category: ProductCategory;
  name: string;
  description?: string;
  price?: number;
  currency: string;
  features?: string[];
  specs?: Record<string, unknown>;
  colors?: string[];
  slug: string;
  keywords?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  release_date?: string;
  discontinued_date?: string;
}

export interface ProductCreateInput {
  sku: string;
  model: string;
  series?: string;
  category: ProductCategory;
  name: string;
  description?: string;
  price?: number;
  currency?: string;
  features?: string[];
  specs?: Record<string, unknown>;
  colors?: string[];
  slug: string;
  keywords?: string[];
  is_active?: boolean;
  release_date?: string;
}

// ============================================================================
// Knowledge Types
// ============================================================================

export type KnowledgeType = 'faq' | 'guide' | 'tutorial' | 'review' | 'spec' | 'comparison' | 'troubleshooting';
export type KnowledgeStatus = 'draft' | 'published' | 'archived' | 'under_review';

export interface KnowledgeItem {
  id: number;
  title: string;
  content: string;
  summary?: string;
  type: KnowledgeType;
  status: KnowledgeStatus;
  product_id?: number;
  tags?: string[];
  language: string;
  source?: string;
  author?: string;
  embedding_id?: string;
  vector_dimension: number;
  quality_score: number;
  readability_score?: number;
  seo_score?: number;
  view_count: number;
  like_count: number;
  share_count: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface KnowledgeCreateInput {
  title: string;
  content: string;
  summary?: string;
  type: KnowledgeType;
  status?: KnowledgeStatus;
  product_id?: number;
  tags?: string[];
  language?: string;
  source?: string;
  author?: string;
}

export interface KnowledgeFilters {
  types?: KnowledgeType[];
  product_ids?: number[];
  tags?: string[];
  language?: string;
  min_quality_score?: number;
  status?: KnowledgeStatus[];
}

// ============================================================================
// Search Types
// ============================================================================

export type SearchType = 'semantic' | 'keyword' | 'hybrid';

export interface SearchRequest {
  query: string;
  search_type?: SearchType;
  top_k?: number;
  filters?: KnowledgeFilters;
  rerank?: boolean;
}

export interface SearchResult {
  knowledge_id: number;
  title: string;
  summary?: string;
  type: string;
  score: number;
  highlights?: string[];
  product_id?: number;
  tags?: string[];
}

export interface SearchResponse {
  query: string;
  total_results: number;
  search_time_ms: number;
  results: SearchResult[];
}

// ============================================================================
// Statistics Types
// ============================================================================

export interface KnowledgeStats {
  total_items: number;
  published_items: number;
  draft_items: number;
  avg_quality_score: number;
  total_views: number;
  total_likes: number;
  items_by_type: Record<string, number>;
  items_by_language: Record<string, number>;
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface AnalyticsOverview {
  total_users: number;
  content_views: number;
  chat_sessions: number;
  avg_engagement: number;
  period: string;
}

export interface UserMetrics {
  active_users: number;
  new_users: number;
  returning_users: number;
  churn_rate: number;
}

export interface ContentMetrics {
  total_content: number;
  views_today: number;
  most_viewed: Array<{
    title: string;
    views: number;
  }>;
}

export interface SearchMetrics {
  total_searches: number;
  avg_results: number;
  top_queries: Array<{
    query: string;
    count: number;
  }>;
}

// ============================================================================
// Content Generation Types
// ============================================================================

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
}

export interface ContentGenerateRequest {
  template: string;
  topic: string;
  keywords?: string[];
  tone?: string;
  length?: number;
}

// ============================================================================
// Support Types
// ============================================================================

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  session_id?: string;
  context?: Record<string, unknown>;
}

export interface ChatResponse {
  response: string;
  session_id: string;
  confidence?: number;
  sources?: SearchResult[];
}

export interface Conversation {
  id: string;
  user_id?: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Auth Types
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  avatar?: string;
}

// ============================================================================
// Health Check Types
// ============================================================================

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  service: string;
  version: string;
  timestamp: number;
}
