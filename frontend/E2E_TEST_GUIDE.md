# Playwright E2E Testing Guide
# Playwright E2E 测试指南

**Version**: 1.0.0
**Last Updated**: 2025-10-22
**Author**: Soundcore KCP Frontend Team

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Test Suite Structure](#test-suite-structure)
3. [Getting Started](#getting-started)
4. [Writing Tests](#writing-tests)
5. [Test Helpers and Fixtures](#test-helpers-and-fixtures)
6. [Running Tests](#running-tests)
7. [Best Practices](#best-practices)
8. [CI/CD Integration](#cicd-integration)
9. [Troubleshooting](#troubleshooting)

---

## 1. Overview

### Purpose

This test suite provides comprehensive E2E (End-to-End) testing for the Soundcore KCP frontend application using Playwright. It simulates real user interactions and validates:

- ✅ Complete user journeys across multiple pages
- ✅ Search functionality with filters and sorting
- ✅ Form interactions and validation
- ✅ Performance metrics (load times, FCP, LCP, CLS)
- ✅ Accessibility compliance (WCAG guidelines)
- ✅ Cross-browser compatibility
- ✅ Responsive design on different devices

### Technology Stack

- **Test Framework**: Playwright 1.42+
- **Language**: TypeScript 5.x
- **Test Runner**: Playwright Test Runner
- **Browsers**: Chromium, Firefox, WebKit
- **CI/CD**: GitHub Actions (optional)

---

## 2. Test Suite Structure

```
tests/
├── e2e/                          # End-to-end tests
│   ├── user-journey.spec.ts      # Complete user workflows (10 tests)
│   ├── search.spec.ts            # Search functionality (20+ tests)
│   ├── forms.spec.ts             # Form interactions (25+ tests)
│   ├── performance.spec.ts       # Performance metrics (15+ tests)
│   ├── dashboard.spec.ts         # Dashboard page tests
│   ├── homepage.spec.ts          # Homepage tests
│   ├── knowledge.spec.ts         # Knowledge page tests
│   └── responsive.spec.ts        # Responsive design tests
│
├── visual-regression/            # Visual regression tests
│   └── components.spec.ts        # Component screenshots (32 tests)
│
├── fixtures/                     # Test data and fixtures
│   └── test-data.ts              # Reusable test data
│
├── helpers/                      # Test helper functions
│   └── test-helpers.ts           # Utility functions
│
└── screenshots/                  # Test screenshots (generated)

playwright.config.ts              # Playwright configuration
```

### Test Categories

| Category | Tests | Purpose |
|----------|-------|---------|
| **User Journeys** | 10 | Complete workflows from start to finish |
| **Search** | 20+ | Search input, filters, results, edge cases |
| **Forms** | 25+ | Form validation, submission, auto-save |
| **Performance** | 15+ | Load times, FCP, LCP, CLS, memory |
| **Visual Regression** | 32 | Component appearance consistency |
| **Responsive** | 5+ | Mobile, tablet, desktop layouts |
| **Accessibility** | 5+ | WCAG compliance, keyboard navigation |

**Total Tests**: 110+ tests

---

## 3. Getting Started

### Prerequisites

```bash
# Node.js 18+ required
node --version

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Quick Start

```bash
# Run all tests
npm run test

# Run specific test file
npx playwright test tests/e2e/user-journey.spec.ts

# Run with UI
npx playwright test --ui

# Run in debug mode
npx playwright test --debug
```

---

## 4. Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    const button = page.locator('button[data-testid="submit"]');

    // Act
    await button.click();

    // Assert
    await expect(page).toHaveURL('/success');
  });
});
```

### Using Test Helpers

```typescript
import { test, expect } from '@playwright/test';
import {
  navigateToPage,
  performSearch,
  getSearchResults
} from '../helpers/test-helpers';

test('should search for knowledge items', async ({ page }) => {
  await navigateToPage(page, '/knowledge');
  await performSearch(page, 'bluetooth');

  const resultCount = await getSearchResults(page);
  expect(resultCount).toBeGreaterThan(0);
});
```

### Using Test Data

```typescript
import { test, expect } from '@playwright/test';
import { testSearchQueries, testFormData } from '../fixtures/test-data';

test('should search with multiple queries', async ({ page }) => {
  await page.goto('/knowledge');

  for (const query of testSearchQueries) {
    await performSearch(page, query);
    // Assert results...
  }
});
```

---

## 5. Test Helpers and Fixtures

### Available Helpers

#### Navigation

```typescript
// Navigate to page
await navigateToPage(page, '/dashboard');

// Navigate via link
await navigateViaLink(page, '/knowledge');

// Go back
await goBack(page);

// Refresh page
await refreshPage(page);
```

#### Search

```typescript
// Perform search
await performSearch(page, 'bluetooth headphones');

// Clear search
await clearSearch(page);

// Get search results count
const count = await getSearchResults(page);

// Check for empty state
const isEmpty = await hasEmptyState(page);
```

#### Forms

```typescript
// Fill form with data
await fillForm(page, {
  topic: 'Best Headphones',
  keywords: 'wireless, bluetooth',
});

// Submit form
await submitForm(page);

// Clear form
await clearForm(page);
```

#### Chat

```typescript
// Send chat message
await sendChatMessage(page, 'Hello, I need help');

// Get message count
const count = await getChatMessages(page);

// Get last message
const lastMsg = await getLastChatMessage(page);
```

#### Assertions

```typescript
// Assert page title
await assertPageTitle(page, /Soundcore KCP/);

// Assert URL
await assertURL(page, '/dashboard');

// Assert element visible
await assertElementVisible(page, '[data-testid="header"]');

// Assert text content
await assertElementText(page, 'h1', /Knowledge Base/);
```

#### Performance

```typescript
// Measure page load time
const metrics = await measurePageLoadTime(page, '/');

// Get performance metrics
const perf = await getPerformanceMetrics(page);
console.log(`FCP: ${perf.fcp}ms`);

// Get memory usage
const memory = await getMemoryUsage(page);
```

### Available Test Data

```typescript
import {
  testKnowledgeItems,    // Sample knowledge items
  testProducts,          // Sample products
  testSearchQueries,     // Common search queries
  testContentTypes,      // Content type options
  testChatMessages,      // Sample chat messages
  testAnalytics,         // Analytics data
  testFormData,          // Form test data
  testErrorScenarios,    // Error scenarios
  testURLs,              // App URLs
  testSelectors,         // CSS selectors
  testTimings,           // Timeout values
  testViewports,         // Viewport sizes
} from '../fixtures/test-data';
```

---

## 6. Running Tests

### Run All Tests

```bash
npm run test
# or
npx playwright test
```

### Run Specific Tests

```bash
# By file
npx playwright test user-journey.spec.ts

# By test name
npx playwright test -g "should search for knowledge"

# By browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Tests by Category

```bash
# E2E tests only
npx playwright test tests/e2e

# Visual regression only
npx playwright test tests/visual-regression

# Specific test file
npx playwright test tests/e2e/search.spec.ts
```

### Interactive Modes

```bash
# UI Mode (recommended)
npx playwright test --ui

# Debug Mode
npx playwright test --debug

# Headed Mode (see browser)
npx playwright test --headed

# Slow Motion
npx playwright test --headed --slow-mo=1000
```

### Reporters

```bash
# List reporter (default)
npx playwright test --reporter=list

# HTML report
npx playwright test --reporter=html
npx playwright show-report

# JSON report
npx playwright test --reporter=json

# Multiple reporters
npx playwright test --reporter=list --reporter=html
```

### Update Snapshots

```bash
# Update all visual regression snapshots
npx playwright test --update-snapshots

# Update specific test snapshots
npx playwright test components.spec.ts --update-snapshots
```

---

## 7. Best Practices

### 1. Test Independence

✅ **Good**: Each test can run independently
```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/knowledge');
  // Fresh state for each test
});

test('search test 1', async ({ page }) => {
  // Independent test
});

test('search test 2', async ({ page }) => {
  // Independent test
});
```

❌ **Bad**: Tests depend on each other
```typescript
test('create item', async ({ page }) => {
  // Creates item
});

test('edit item', async ({ page }) => {
  // Depends on previous test
});
```

### 2. Use Test Helpers

✅ **Good**: Reuse helper functions
```typescript
test('should search', async ({ page }) => {
  await performSearch(page, 'query');
  const count = await getSearchResults(page);
  expect(count).toBeGreaterThan(0);
});
```

❌ **Bad**: Duplicate code
```typescript
test('should search', async ({ page }) => {
  const input = page.locator('input[type="search"]');
  await input.fill('query');
  await page.keyboard.press('Enter');
  // ...duplicate code
});
```

### 3. Meaningful Assertions

✅ **Good**: Specific, meaningful assertions
```typescript
test('should load dashboard', async ({ page }) => {
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Dashboard');
  await expect(page.locator('[data-testid="stat-card"]')).toHaveCount(4);
});
```

❌ **Bad**: Vague or missing assertions
```typescript
test('should load dashboard', async ({ page }) => {
  await page.goto('/dashboard');
  // No assertions!
});
```

### 4. Use Data-Testid Attributes

✅ **Good**: Use semantic selectors
```typescript
// In component:
<button data-testid="submit-button">Submit</button>

// In test:
await page.locator('[data-testid="submit-button"]').click();
```

❌ **Bad**: Brittle CSS selectors
```typescript
await page.locator('div.container > div:nth-child(2) > button.primary').click();
```

### 5. Handle Timing Properly

✅ **Good**: Use Playwright auto-waiting
```typescript
await expect(page.locator('[data-testid="result"]')).toBeVisible();
```

❌ **Bad**: Arbitrary timeouts
```typescript
await page.waitForTimeout(5000); // Don't do this
```

### 6. Test Real User Scenarios

✅ **Good**: Complete user journeys
```typescript
test('user searches and views details', async ({ page }) => {
  await page.goto('/knowledge');
  await performSearch(page, 'bluetooth');
  await page.locator('[data-testid="knowledge-card"]').first().click();
  await expect(page).toHaveURL(/\/knowledge\/\d+/);
});
```

❌ **Bad**: Only testing individual functions
```typescript
test('button exists', async ({ page }) => {
  await expect(page.locator('button')).toBeVisible();
});
```

### 7. Clean Up Test Data

✅ **Good**: Clean up after tests
```typescript
test.afterEach(async ({ page }) => {
  await clearLocalStorage(page);
  // Clean up test data
});
```

### 8. Descriptive Test Names

✅ **Good**: Clear, descriptive names
```typescript
test('should display validation error when submitting empty form', async ({ page }) => {
  // ...
});
```

❌ **Bad**: Vague names
```typescript
test('test1', async ({ page }) => {
  // ...
});
```

---

## 8. CI/CD Integration

### GitHub Actions

Create `.github/workflows/e2e-tests.yml`:

```yaml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

      - name: Upload screenshots
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: test-screenshots
          path: test-results/
          retention-days: 7
```

### Running Tests in Docker

```dockerfile
FROM mcr.microsoft.com/playwright:v1.42.0-focal

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npm", "run", "test"]
```

```bash
# Build Docker image
docker build -t kcp-e2e-tests .

# Run tests in container
docker run --rm kcp-e2e-tests
```

---

## 9. Troubleshooting

### Common Issues

#### Issue 1: Tests timeout

**Solution**:
```typescript
// Increase timeout for specific test
test('slow operation', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ...
});

// Or in config
// playwright.config.ts
timeout: 30000,
```

#### Issue 2: Element not found

**Solution**:
```typescript
// Wait for element explicitly
await page.waitForSelector('[data-testid="element"]', { timeout: 10000 });

// Or use soft assertions
await expect.soft(page.locator('[data-testid="element"]')).toBeVisible();
```

#### Issue 3: Flaky tests

**Solution**:
```typescript
// Use auto-waiting
await expect(page.locator('[data-testid="result"]')).toBeVisible();

// Avoid arbitrary timeouts
// ❌ await page.waitForTimeout(1000);
// ✅ await page.waitForLoadState('networkidle');
```

#### Issue 4: Screenshot differences

**Solution**:
```bash
# Update baselines
npx playwright test --update-snapshots

# Increase threshold
// playwright.config.ts
expect: {
  toMatchSnapshot: { threshold: 0.2 },
},
```

### Debug Tips

```bash
# Run with debug mode
npx playwright test --debug

# Run headed (see browser)
npx playwright test --headed

# Trace viewer
npx playwright test --trace on
npx playwright show-trace trace.zip

# Screenshots on failure (automatic)
# See: test-results/

# Video recording
// playwright.config.ts
use: {
  video: 'on-first-retry',
},
```

---

## 📊 Test Coverage Summary

| Category | Tests | Coverage |
|----------|-------|----------|
| User Journeys | 10 | ✅ Complete workflows |
| Search | 20+ | ✅ All search features |
| Forms | 25+ | ✅ Validation, submission |
| Performance | 15+ | ✅ Load times, metrics |
| Visual Regression | 32 | ✅ Component appearance |
| Responsive | 5+ | ✅ Mobile, tablet, desktop |
| Accessibility | 5+ | ✅ WCAG compliance |
| **Total** | **110+** | **✅ Comprehensive** |

---

## 📚 Additional Resources

- **Playwright Documentation**: https://playwright.dev/
- **Playwright Best Practices**: https://playwright.dev/docs/best-practices
- **Test Debugging**: https://playwright.dev/docs/debug
- **CI/CD Integration**: https://playwright.dev/docs/ci
- **API Reference**: https://playwright.dev/docs/api/class-playwright

---

## ✅ Next Steps

1. **Run Tests Locally**:
   ```bash
   npm run test
   ```

2. **View Test Report**:
   ```bash
   npx playwright show-report
   ```

3. **Add Custom Tests**:
   - Create new test file in `tests/e2e/`
   - Follow naming convention: `*.spec.ts`
   - Use test helpers from `tests/helpers/`

4. **Integrate with CI/CD**:
   - Add GitHub Actions workflow
   - Configure test scheduling
   - Set up notifications

---

**Document Version**: 1.0.0
**Last Updated**: 2025-10-22
**Maintained By**: Soundcore KCP Frontend Team
**Next Review**: 2025-11-22
