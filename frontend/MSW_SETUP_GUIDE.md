# MSW (Mock Service Worker) Setup Guide
# MSW API 模拟设置指南

**Version**: 1.0.0
**Last Updated**: 2025-10-22
**Purpose**: Mock API responses for reliable E2E testing

---

## 📋 Overview

Mock Service Worker (MSW) allows you to intercept and mock API requests in tests, providing:

✅ **Consistent test data** - No dependency on backend availability
✅ **Faster tests** - No network delays
✅ **Reliable tests** - No flaky tests due to API changes
✅ **Offline testing** - Test without internet connection
✅ **Error scenario testing** - Easily test error handling

---

## 🚀 Installation

### Step 1: Install MSW

```bash
cd frontend
npm install -D msw@latest
```

### Step 2: Initialize MSW

```bash
# Generate service worker file in public directory
npx msw init public/ --save
```

This creates `public/mockServiceWorker.js` which intercepts browser requests.

---

## 📁 File Structure

```
frontend/
├── tests/
│   └── mocks/
│       ├── handlers.ts          ✅ Created - API mock handlers
│       └── browser.ts           ✅ Created - MSW browser setup
│
├── public/
│   └── mockServiceWorker.js    ⚠️  Run: npx msw init public/
│
└── MSW_SETUP_GUIDE.md           ✅ Created - This guide
```

---

## 🛠️ Configuration

### 1. Update Handler Files

Edit `tests/mocks/handlers.ts` and uncomment the handlers:

```typescript
import { http, HttpResponse } from 'msw';

const API_BASE = 'http://localhost:8000/api/v1';

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
      ],
      total: 1,
      page: 1,
      page_size: 20,
    });
  }),

  // Add more handlers...
];

export const handlers = [...knowledgeHandlers];
```

### 2. Update Browser Setup

Edit `tests/mocks/browser.ts` and uncomment the code:

```typescript
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

export function startMockWorker() {
  if (typeof window !== 'undefined') {
    return worker.start({
      onUnhandledRequest: 'bypass',
      quiet: false,
    });
  }
}
```

### 3. Create Playwright Global Setup

Create `playwright.global-setup.ts`:

```typescript
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // Optional: Start MSW worker in setup
  console.log('Setting up MSW for E2E tests...');
}

export default globalSetup;
```

### 4. Update Playwright Config

Add to `playwright.config.ts`:

```typescript
export default defineConfig({
  // ... existing config

  // Global setup
  globalSetup: './playwright.global-setup.ts',

  // Use MSW handlers in tests
  use: {
    baseURL: 'http://localhost:3000',

    // Inject MSW setup script
    contextOptions: {
      // Optional: Add service worker support
    },
  },
});
```

---

## 🧪 Using MSW in Tests

### Basic Usage

```typescript
import { test, expect } from '@playwright/test';

test('should fetch mocked knowledge items', async ({ page }) => {
  await page.goto('/knowledge');

  // MSW automatically intercepts API calls
  // and returns mocked data

  // Verify mocked data is displayed
  await expect(page.getByText('How to connect Bluetooth headphones')).toBeVisible();
});
```

### Override Handlers for Specific Tests

```typescript
import { test, expect } from '@playwright/test';
import { http, HttpResponse } from 'msw';

test('should handle API error', async ({ page, context }) => {
  // Mock error response
  await page.route('**/api/v1/knowledge/items', (route) => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' }),
    });
  });

  await page.goto('/knowledge');

  // Verify error handling
  await expect(page.getByText(/error/i)).toBeVisible();
});
```

### Mock Delayed Responses

```typescript
test('should show loading state', async ({ page, context }) => {
  await page.route('**/api/v1/knowledge/items', async (route) => {
    // Delay response by 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ items: [] }),
    });
  });

  await page.goto('/knowledge');

  // Verify loading indicator appears
  await expect(page.getByText(/loading/i)).toBeVisible();

  // Wait for data to load
  await page.waitForTimeout(2500);
});
```

---

## 📝 Mock Data Examples

### Knowledge Items

```typescript
// tests/mocks/data/knowledge.ts
export const mockKnowledgeItems = [
  {
    id: 1,
    title: 'Bluetooth Connection Guide',
    content: 'Step 1: Turn on Bluetooth...',
    type: 'FAQ',
    language: 'EN',
    quality_score: 95.5,
    tags: ['bluetooth', 'connectivity'],
    created_at: '2025-10-22T10:30:00Z',
  },
  {
    id: 2,
    title: 'Noise Cancellation Technology',
    content: 'Active Noise Cancellation (ANC)...',
    type: 'GUIDE',
    language: 'EN',
    quality_score: 92.3,
    tags: ['anc', 'technology'],
    created_at: '2025-10-22T11:00:00Z',
  },
];
```

### Products

```typescript
export const mockProducts = [
  {
    id: 1,
    sku: 'A3040',
    model: 'Space A40',
    series: 'Space Series',
    category: 'Earbuds',
    features: ['ANC', 'LDAC', '50H Battery'],
  },
];
```

### Chat Messages

```typescript
export const mockChatMessages = [
  {
    id: 'msg_1',
    message: 'Hello, how can I help you?',
    role: 'assistant',
    timestamp: '2025-10-22T14:00:00Z',
  },
];
```

---

## 🎯 Advanced Patterns

### 1. Dynamic Responses

```typescript
http.get(`${API_BASE}/knowledge/items`, ({ request }) => {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || '1';
  const pageSize = url.searchParams.get('page_size') || '20';

  return HttpResponse.json({
    items: mockKnowledgeItems.slice(
      (Number(page) - 1) * Number(pageSize),
      Number(page) * Number(pageSize)
    ),
    total: mockKnowledgeItems.length,
    page: Number(page),
    page_size: Number(pageSize),
  });
}),
```

### 2. Stateful Mocks

```typescript
let knowledgeItems = [...mockKnowledgeItems];

http.post(`${API_BASE}/knowledge/items`, async ({ request }) => {
  const newItem = await request.json();
  const item = {
    id: knowledgeItems.length + 1,
    ...newItem,
    created_at: new Date().toISOString(),
  };

  knowledgeItems.push(item);

  return HttpResponse.json(item, { status: 201 });
}),
```

### 3. Error Scenarios

```typescript
// Network error
http.get(`${API_BASE}/knowledge/items`, () => {
  return HttpResponse.error();
}),

// 404 Not Found
http.get(`${API_BASE}/knowledge/items/:id`, ({ params }) => {
  return HttpResponse.json(
    { error: 'Knowledge item not found' },
    { status: 404 }
  );
}),

// 500 Server Error
http.post(`${API_BASE}/knowledge/items`, () => {
  return HttpResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}),
```

---

## 🔧 Troubleshooting

### Issue 1: MSW not intercepting requests

**Solution**:
- Check if `mockServiceWorker.js` is in `public/` directory
- Verify service worker is registered: Open DevTools → Application → Service Workers
- Clear browser cache and reload

### Issue 2: Handlers not working

**Solution**:
- Check handler order (more specific handlers first)
- Verify API URL matches exactly
- Use `onUnhandledRequest: 'warn'` to see unhandled requests

### Issue 3: CORS errors with MSW

**Solution**:
```typescript
worker.start({
  onUnhandledRequest: 'bypass',
  serviceWorker: {
    options: {
      scope: '/',
    },
  },
});
```

---

## 📊 Benefits of MSW in Tests

| Benefit | Description |
|---------|-------------|
| **Fast** | No network delays, instant responses |
| **Reliable** | No dependency on backend availability |
| **Flexible** | Easy to test error scenarios |
| **Realistic** | Intercepts at network level, not code level |
| **Debugging** | See requests/responses in DevTools Network tab |

---

## 🚦 Test Scenarios to Mock

### 1. Happy Path
- Successful API responses
- Proper data rendering
- Normal user flows

### 2. Error Handling
- Network errors
- 404 Not Found
- 500 Server errors
- Validation errors

### 3. Edge Cases
- Empty results
- Large datasets
- Slow responses (timeouts)
- Concurrent requests

### 4. Authentication
- Unauthorized (401)
- Forbidden (403)
- Session expiry

---

## 📚 Resources

- **MSW Documentation**: https://mswjs.io/
- **Playwright + MSW**: https://mswjs.io/docs/integrations/browser
- **Examples**: https://github.com/mswjs/examples

---

## ✅ Quick Start Checklist

- [ ] Install MSW: `npm install -D msw@latest`
- [ ] Initialize MSW: `npx msw init public/ --save`
- [ ] Uncomment handlers in `tests/mocks/handlers.ts`
- [ ] Uncomment setup in `tests/mocks/browser.ts`
- [ ] Update Playwright config
- [ ] Run tests to verify mocking works
- [ ] Add custom handlers for your API endpoints

---

## 🎯 Next Steps

1. **Implement all API handlers** for your endpoints
2. **Create mock data** for different scenarios
3. **Test error handling** with mocked errors
4. **Optimize test speed** by removing real API calls
5. **Document mocked endpoints** for team reference

---

**Document Version**: 1.0.0
**Maintained By**: Soundcore KCP Frontend Team
**Next Review**: 2025-11-22
