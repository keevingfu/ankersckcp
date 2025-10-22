/**
 * Test Data Fixtures
 * Common test data used across E2E tests
 */

export const testKnowledgeItems = [
  {
    id: 1,
    title: 'How to connect Bluetooth headphones',
    content: 'Step-by-step guide to connecting your Bluetooth headphones...',
    type: 'FAQ',
    language: 'EN',
    qualityScore: 95.5,
    tags: ['bluetooth', 'connectivity', 'troubleshooting'],
    createdAt: '2025-10-22T10:30:00Z',
  },
  {
    id: 2,
    title: 'Noise Cancellation Features',
    content: 'Learn about active noise cancellation technology in our headphones...',
    type: 'GUIDE',
    language: 'EN',
    qualityScore: 92.3,
    tags: ['noise-cancellation', 'features', 'technology'],
    createdAt: '2025-10-22T11:00:00Z',
  },
  {
    id: 3,
    title: 'Space A40 Product Specifications',
    content: 'Complete technical specifications for Space A40 headphones...',
    type: 'ARTICLE',
    language: 'EN',
    qualityScore: 98.1,
    tags: ['space-a40', 'specifications', 'product-info'],
    createdAt: '2025-10-22T12:00:00Z',
  },
];

export const testProducts = [
  {
    id: 1,
    sku: 'A3040',
    model: 'Space A40',
    series: 'Space Series',
    category: 'Earbuds',
    features: ['Active Noise Cancellation', 'LDAC Hi-Res Audio', '50H Playtime'],
    specs: {
      battery: '50 hours',
      driver: '10mm',
      connectivity: 'Bluetooth 5.3',
    },
  },
  {
    id: 2,
    sku: 'Q45',
    model: 'Space Q45',
    series: 'Space Series',
    category: 'Headphones',
    features: ['Adaptive ANC', 'LDAC/Hi-Res', '50H Playtime', 'Ultra Comfort'],
    specs: {
      battery: '50 hours',
      driver: '40mm',
      connectivity: 'Bluetooth 5.3',
    },
  },
];

export const testSearchQueries = [
  'bluetooth headphones',
  'noise cancellation',
  'Space A40',
  'how to connect',
  'battery life',
  'wireless earbuds',
  'sound quality',
  'product comparison',
];

export const testContentTypes = [
  { value: 'BLOG', label: 'Blog Article' },
  { value: 'SOCIAL', label: 'Social Media Post' },
  { value: 'EMAIL', label: 'Email Marketing' },
  { value: 'PRODUCT_DESC', label: 'Product Description' },
  { value: 'COMPARISON', label: 'Product Comparison' },
];

export const testChatMessages = [
  {
    role: 'user',
    content: 'What are the best features of Space A40?',
    timestamp: '2025-10-22T14:00:00Z',
  },
  {
    role: 'assistant',
    content: 'The Space A40 offers exceptional features including...',
    timestamp: '2025-10-22T14:00:05Z',
  },
  {
    role: 'user',
    content: 'How does it compare to competitors?',
    timestamp: '2025-10-22T14:01:00Z',
  },
];

export const testAnalytics = {
  overview: {
    totalKnowledgeItems: 1234,
    totalContent: 456,
    totalConversations: 789,
    averageQualityScore: 92.5,
  },
  userMetrics: {
    activeUsers: 5432,
    newUsers: 234,
    returningUsers: 5198,
    averageSessionDuration: '5m 23s',
  },
  contentMetrics: {
    articlesGenerated: 456,
    socialPosts: 234,
    emails: 123,
    productDescriptions: 99,
  },
  searchMetrics: {
    totalSearches: 9876,
    averageResultsPerSearch: 12.3,
    topQueries: testSearchQueries.slice(0, 5),
  },
};

export const testFormData = {
  contentGeneration: {
    type: 'BLOG',
    topic: 'Best Wireless Headphones 2025',
    keywords: 'wireless, headphones, noise cancellation, bluetooth',
    tone: 'professional',
    length: 'medium',
  },
  knowledgeItem: {
    title: 'Test Knowledge Item',
    content: 'This is a test knowledge item created for E2E testing purposes.',
    type: 'FAQ',
    language: 'EN',
    tags: ['test', 'e2e', 'automation'],
  },
  chatMessage: {
    message: 'Hello, I need help with my Soundcore headphones',
  },
};

export const testErrorScenarios = {
  networkError: {
    type: 'network',
    message: 'Network request failed',
    code: 'ERR_NETWORK',
  },
  validationError: {
    type: 'validation',
    message: 'Please fill in all required fields',
    code: 'ERR_VALIDATION',
  },
  notFoundError: {
    type: 'not_found',
    message: 'Resource not found',
    code: '404',
  },
  serverError: {
    type: 'server',
    message: 'Internal server error',
    code: '500',
  },
};

export const testURLs = {
  homepage: '/',
  dashboard: '/dashboard',
  knowledge: '/knowledge',
  knowledgeGraph: '/knowledge-graph',
  contentGenerator: '/content-generator',
  smartChat: '/smart-chat',
  analytics: '/analytics',
  notFound: '/non-existent-page-12345',
};

export const testSelectors = {
  navigation: {
    logo: 'a[href="/"]',
    dashboardLink: 'a[href="/dashboard"]',
    knowledgeLink: 'a[href="/knowledge"]',
    contentGeneratorLink: 'a[href="/content-generator"]',
    smartChatLink: 'a[href="/smart-chat"]',
    analyticsLink: 'a[href="/analytics"]',
  },
  search: {
    input: 'input[placeholder*="Search"], input[type="search"]',
    button: 'button[type="submit"], button[aria-label*="search"]',
    results: '[data-testid="knowledge-card"], .knowledge-item, article',
    emptyState: 'text=/no results|empty|not found/i, [data-testid="empty-state"]',
  },
  forms: {
    contentType: 'select[name*="type"], select[name*="contentType"]',
    topic: 'input[name*="topic"], input[name*="title"], textarea[name*="topic"]',
    keywords: 'input[name*="keyword"], textarea[name*="keyword"]',
    submit: 'button[type="submit"], button:has-text("Generate"), button:has-text("Create")',
    clear: 'button:has-text("Clear"), button:has-text("Reset")',
  },
  chat: {
    input: 'input[placeholder*="message"], textarea[placeholder*="message"]',
    send: 'button[type="submit"], button:has-text("Send")',
    messages: '[data-testid="message"], .message, .chat-message',
  },
  dashboard: {
    statCards: '[data-testid="stat-card"], .stat-card, .metric-card',
    charts: 'canvas, svg[class*="chart"], [class*="recharts"]',
  },
};

export const testTimings = {
  short: 300,
  medium: 1000,
  long: 2000,
  veryLong: 5000,
};

export const testViewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 },
  wide: { width: 2560, height: 1440 },
};
