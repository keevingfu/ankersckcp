/**
 * Mock Data for Development and Testing
 * 开发和测试用的模拟数据
 */

import type {
  KnowledgeItem,
  Product,
  KnowledgeStats,
  AnalyticsOverview,
  UserMetrics,
  ContentMetrics,
  SearchMetrics,
  PaginatedResponse,
} from './types';

// ============================================================================
// Knowledge Service Mock Data
// ============================================================================

export const mockProducts: Product[] = [
  {
    id: 1,
    sku: 'A3951011',
    model: 'Liberty 4 Pro',
    series: 'Liberty',
    category: 'earbuds',
    name: 'Liberty 4 Pro Wireless Earbuds',
    price: 129.99,
    currency: 'USD',
    slug: 'liberty-4-pro',
    features: ['Active Noise Cancellation', 'LDAC Hi-Res Audio', 'Spatial Audio', '10mm Drivers'],
    specs: {
      battery_life: '10 hours (earbuds) + 40 hours (case)',
      charging: 'USB-C + Wireless',
      water_resistance: 'IPX5',
      bluetooth: '5.3',
    },
    is_active: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-10-15T00:00:00Z',
  },
  {
    id: 2,
    sku: 'A3926011',
    model: 'Space A40',
    series: 'Space',
    category: 'earbuds',
    name: 'Space A40 Adaptive ANC Earbuds',
    price: 79.99,
    currency: 'USD',
    slug: 'space-a40',
    features: ['Adaptive ANC', '50-Hour Playtime', 'Multipoint Connection', 'LDAC'],
    specs: {
      battery_life: '10 hours (earbuds) + 40 hours (case)',
      charging: 'USB-C + Wireless',
      water_resistance: 'IPX4',
      bluetooth: '5.3',
    },
    is_active: true,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-10-10T00:00:00Z',
  },
  {
    id: 3,
    sku: 'A3040011',
    model: 'Life Q30',
    series: 'Life',
    category: 'headphones',
    currency: 'USD',
    slug: 'life-q30',
    name: 'Life Q30 Hybrid ANC Headphones',
    price: 79.99,
    features: ['Hybrid Active Noise Cancellation', '40mm Drivers', 'Multi-Mode ANC', 'Hi-Res Audio'],
    specs: {
      battery_life: '40 hours (ANC on) / 60 hours (ANC off)',
      charging: 'USB-C',
      water_resistance: 'N/A',
      bluetooth: '5.0',
    },
    is_active: true,
    created_at: '2023-06-01T00:00:00Z',
    updated_at: '2024-10-01T00:00:00Z',
  },
];

export const mockKnowledgeItems: KnowledgeItem[] = [
  {
    id: 1,
    title: 'How to pair Liberty 4 Pro with your device',
    content: `# Pairing Liberty 4 Pro with Your Device

## First Time Pairing

1. Remove the earbuds from the charging case
2. Open your device's Bluetooth settings
3. Select "Soundcore Liberty 4 Pro" from the list
4. Wait for the connection confirmation

## Troubleshooting

If you experience pairing issues:
- Make sure the earbuds are charged
- Reset the earbuds by holding the button for 10 seconds
- Clear the Bluetooth cache on your device
- Try pairing in a different location`,
    type: 'guide',
    status: 'published',
    product_id: 1,
    tags: ['pairing', 'bluetooth', 'setup', 'liberty-4-pro'],
    source: 'internal',
    quality_score: 95,
    view_count: 1245,
    like_count: 89,
    language: 'en',
    vector_dimension: 1536,
    share_count: 0,
    created_at: '2024-09-01T00:00:00Z',
    updated_at: '2024-10-10T00:00:00Z',
  },
  {
    id: 2,
    title: 'Liberty 4 Pro Active Noise Cancellation Modes',
    content: `# Understanding ANC Modes on Liberty 4 Pro

## Adaptive Mode
Automatically adjusts noise cancellation based on your environment. Perfect for everyday use.

## Transport Mode
Optimized for travel - blocks low-frequency engine noise effectively.

## Indoor Mode
Reduces background chatter and ambient noise in offices and quiet spaces.

## Outdoor Mode
Balances noise cancellation with environmental awareness for safety.

## Switching Modes
- Use the Soundcore app to select your preferred mode
- Or press and hold the left earbud for 2 seconds to cycle through modes`,
    type: 'guide',
    status: 'published',
    product_id: 1,
    tags: ['anc', 'noise-cancellation', 'features', 'liberty-4-pro'],
    source: 'internal',
    quality_score: 92,
    view_count: 987,
    like_count: 134,
    language: 'en',
    vector_dimension: 1536,
    share_count: 0,
    created_at: '2024-09-05T00:00:00Z',
    updated_at: '2024-10-05T00:00:00Z',
  },
  {
    id: 3,
    title: 'Battery optimization tips for Soundcore earbuds',
    content: `# Maximizing Battery Life on Your Soundcore Earbuds

## Charging Best Practices
- Charge earbuds when they drop to 20-30%
- Avoid leaving earbuds at 100% for extended periods
- Use the official charging cable and adapter

## Usage Tips
- Lower volume when possible (high volume drains battery faster)
- Disable ANC when not needed
- Turn off unused features like Transparency Mode
- Keep firmware updated for battery optimization

## Storage
- Store at 40-60% charge if not using for extended periods
- Avoid extreme temperatures
- Clean charging contacts regularly`,
    type: 'guide',
    status: 'published',
    product_id: undefined,
    tags: ['battery', 'maintenance', 'tips', 'optimization'],
    source: 'internal',
    quality_score: 88,
    view_count: 856,
    like_count: 67,
    language: 'en',
    vector_dimension: 1536,
    share_count: 0,
    created_at: '2024-08-15T00:00:00Z',
    updated_at: '2024-10-03T00:00:00Z',
  },
  {
    id: 4,
    title: 'Warranty and support information',
    content: `# Soundcore Warranty & Support

## Warranty Coverage
- 18-month warranty on all products
- Extended to 24 months when you register your product
- Covers manufacturing defects and hardware failures

## What's Not Covered
- Physical damage from misuse
- Water damage (unless product is IP-rated and damage is within rating)
- Normal wear and tear
- Third-party accessories

## How to Claim Warranty
1. Visit support.soundcore.com
2. Select your product
3. Describe the issue
4. Provide proof of purchase
5. Follow the instructions provided

## Contact Support
- Email: support@soundcore.com
- Phone: 1-800-988-7973 (Mon-Fri 9AM-5PM PST)
- Live Chat: Available on our website`,
    type: 'faq',
    status: 'published',
    product_id: undefined,
    tags: ['warranty', 'support', 'policy', 'contact'],
    source: 'internal',
    quality_score: 90,
    view_count: 734,
    like_count: 45,
    language: 'en',
    vector_dimension: 1536,
    share_count: 0,
    created_at: '2024-07-01T00:00:00Z',
    updated_at: '2024-10-01T00:00:00Z',
  },
  {
    id: 5,
    title: 'Space A40 vs Liberty 4 Pro comparison',
    content: `# Space A40 vs Liberty 4 Pro: Which Should You Choose?

## Liberty 4 Pro
**Best for**: Audiophiles and premium features
- Superior sound quality with LDAC
- More advanced ANC with Spatial Audio
- Premium build quality
- Higher price point ($129.99)

## Space A40
**Best for**: Value seekers and long battery life
- Excellent battery life (50 hours total)
- Adaptive ANC that's good enough for most
- Great value for money ($79.99)
- Lighter and more comfortable for extended wear

## Key Differences
| Feature | Liberty 4 Pro | Space A40 |
|---------|--------------|-----------|
| Price | $129.99 | $79.99 |
| ANC Type | Advanced Multi-Mode | Adaptive |
| Battery | 50 hours total | 50 hours total |
| Audio Quality | LDAC + Spatial | LDAC |
| Driver Size | 10mm | 10mm |

## Recommendation
- Choose Liberty 4 Pro if you want the best audio quality and don't mind the premium price
- Choose Space A40 if you want great value with solid features`,
    type: 'review',
    status: 'published',
    product_id: undefined,
    tags: ['comparison', 'liberty-4-pro', 'space-a40', 'buying-guide'],
    source: 'internal',
    quality_score: 94,
    view_count: 1450,
    like_count: 178,
    language: 'en',
    vector_dimension: 1536,
    share_count: 0,
    created_at: '2024-09-15T00:00:00Z',
    updated_at: '2024-10-12T00:00:00Z',
  },
  {
    id: 6,
    title: '[DRAFT] Upcoming Liberty 5 features',
    content: `# Liberty 5 - Coming Soon

## Expected Features
- Next-gen ANC with AI noise learning
- Extended battery life (12 hours + 48 hours case)
- Improved LDAC codec support
- Enhanced app features

*Note: This is draft content pending official announcement*`,
    type: 'guide',
    status: 'draft',
    product_id: undefined,
    tags: ['liberty-5', 'upcoming', 'draft'],
    source: 'internal',
    quality_score: 65,
    view_count: 45,
    like_count: 3,
    language: 'en',
    vector_dimension: 1536,
    share_count: 0,
    created_at: '2024-10-15T00:00:00Z',
    updated_at: '2024-10-15T00:00:00Z',
  },
];

export const mockKnowledgeStats: KnowledgeStats = {
  total_items: 847,
  published_items: 756,
  draft_items: 67,
  avg_quality_score: 87.3,
  total_views: 45234,
  total_likes: 3421,
  items_by_type: {
    faq: 234,
    guide: 189,
    troubleshooting: 156,
    tutorial: 145,
    review: 123,
  },
  items_by_language: {
    en: 847,
  },
};

// ============================================================================
// Analytics Service Mock Data
// ============================================================================

export const mockAnalyticsOverview: AnalyticsOverview = {
  total_users: 12543,
  content_views: 89234,
  chat_sessions: 34567,
  avg_engagement: 68.5,
  period: 'Oct 10-17, 2024',
};

export const mockUserMetrics: UserMetrics = {
  active_users: 12543,
  new_users: 1234,
  returning_users: 11309,
  churn_rate: 21.5,
};

export const mockContentMetrics: ContentMetrics = {
  total_content: 847,
  views_today: 2543,
  most_viewed: [
    { title: 'Space A40 vs Liberty 4 Pro comparison', views: 1450 },
    { title: 'How to pair Liberty 4 Pro with your device', views: 1245 },
    { title: 'Liberty 4 Pro Active Noise Cancellation Modes', views: 987 },
    { title: 'Battery optimization tips for Soundcore earbuds', views: 856 },
    { title: 'Warranty and support information', views: 734 },
  ],
};

export const mockSearchMetrics: SearchMetrics = {
  total_searches: 15678,
  avg_results: 12.3,
  top_queries: [
    { query: 'pairing issues', count: 567 },
    { query: 'battery life', count: 489 },
    { query: 'noise cancellation', count: 432 },
    { query: 'warranty', count: 398 },
    { query: 'reset earbuds', count: 356 },
  ],
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Simulate API delay
 */
export const delay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Simulate paginated response
 */
export function createPaginatedResponse<T>(
  items: T[],
  page: number = 1,
  pageSize: number = 20
): PaginatedResponse<T> {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedItems = items.slice(start, end);

  return {
    items: paginatedItems,
    total: items.length,
    page,
    page_size: pageSize,
    total_pages: Math.ceil(items.length / pageSize),
  };
}

/**
 * Filter knowledge items
 */
export function filterKnowledgeItems(
  items: KnowledgeItem[],
  filters: {
    type?: string;
    status?: string;
    product_id?: number;
    tags?: string[];
  }
): KnowledgeItem[] {
  return items.filter((item) => {
    if (filters.type && item.type !== filters.type) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.product_id && item.product_id !== filters.product_id) return false;
    if (filters.tags && filters.tags.length > 0) {
      const hasTag = filters.tags.some((tag) => item.tags?.includes(tag));
      if (!hasTag) return false;
    }
    return true;
  });
}
