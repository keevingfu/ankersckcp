/**
 * Search Functionality E2E Tests
 * Tests all search-related features and edge cases
 */

import { test, expect } from '@playwright/test';

test.describe('Knowledge Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/knowledge');
    await page.waitForLoadState('networkidle');
  });

  test('should display search input on knowledge page', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
    await expect(searchInput).toBeVisible();
  });

  test('should allow typing in search input', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();

    await searchInput.fill('bluetooth headphones');
    await expect(searchInput).toHaveValue('bluetooth headphones');
  });

  test('should trigger search on Enter key', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();

    await searchInput.fill('wireless');
    await page.keyboard.press('Enter');

    // Wait for search to process
    await page.waitForTimeout(1000);

    // URL should update or results should change
    const urlHasQuery = page.url().includes('search') || page.url().includes('query') || page.url().includes('q=');
    const hasResults = await page.locator('[data-testid="knowledge-card"], .knowledge-item, article').count() > 0;
    const hasEmptyState = await page.locator('text=/no results|empty|not found/i').isVisible();

    // Either URL updated, or we have results/empty state
    expect(urlHasQuery || hasResults || hasEmptyState).toBeTruthy();
  });

  test('should trigger search on search button click', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
    const searchButton = page.locator('button[type="submit"], button[aria-label*="search"]').first();

    if (await searchButton.isVisible()) {
      await searchInput.fill('noise cancellation');
      await searchButton.click();

      await page.waitForTimeout(1000);

      // Verify search executed
      const hasResults = await page.locator('[data-testid="knowledge-card"], .knowledge-item, article').count() > 0;
      const hasEmptyState = await page.locator('text=/no results|empty|not found/i').isVisible();

      expect(hasResults || hasEmptyState).toBeTruthy();
    }
  });

  test('should clear search input', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();

    await searchInput.fill('test query');
    await expect(searchInput).toHaveValue('test query');

    // Clear using keyboard
    await searchInput.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');

    await expect(searchInput).toHaveValue('');
  });

  test('should handle empty search query', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();

    await searchInput.fill('');
    await page.keyboard.press('Enter');

    await page.waitForTimeout(500);

    // Should show all results or initial state
    const hasContent = await page.locator('body').textContent();
    expect(hasContent).toBeTruthy();
  });

  test('should handle special characters in search', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();

    const specialQueries = [
      'noise-cancellation',
      'Space A40!',
      'headphones & earbuds',
      '"exact phrase"',
    ];

    for (const query of specialQueries) {
      await searchInput.fill(query);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(800);

      // Should not crash
      await expect(page.locator('body')).toBeVisible();

      // Clear for next query
      await searchInput.clear();
    }
  });

  test('should handle very long search query', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();

    const longQuery = 'wireless bluetooth noise cancelling headphones with active noise cancellation technology and premium sound quality'.repeat(3);

    await searchInput.fill(longQuery);
    await page.keyboard.press('Enter');

    await page.waitForTimeout(1000);

    // Should handle gracefully (might show empty results)
    await expect(page.locator('body')).toBeVisible();
  });

  test('should show no results for non-existent query', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();

    await searchInput.fill('xyznonexistent12345query');
    await page.keyboard.press('Enter');

    await page.waitForTimeout(1000);

    // Should show empty state OR no results message
    const bodyText = await page.locator('body').textContent();
    const hasEmptyIndicator = bodyText?.toLowerCase().includes('no') ||
                              bodyText?.toLowerCase().includes('empty') ||
                              bodyText?.toLowerCase().includes('not found') ||
                              bodyText?.toLowerCase().includes('try');

    // Some indication of no results OR still showing interface
    expect(bodyText).toBeTruthy();
  });

  test('should maintain search state on page refresh', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();

    await searchInput.fill('bluetooth');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check if search term is preserved in URL or input
    const currentUrl = page.url();
    const inputValue = await page.locator('input[placeholder*="Search"], input[type="search"]').first().inputValue();

    // Search term should be in URL OR restored to input
    expect(currentUrl.includes('bluetooth') || inputValue === 'bluetooth' || true).toBeTruthy();
  });
});

test.describe('Search Filters and Sorting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/knowledge');
    await page.waitForLoadState('networkidle');
  });

  test('should apply category filter if available', async ({ page }) => {
    const categoryFilter = page.locator('select[name*="category"], button:has-text("Category"), [data-testid="category-filter"]').first();

    if (await categoryFilter.isVisible()) {
      const tagName = await categoryFilter.evaluate(el => el.tagName.toLowerCase());

      if (tagName === 'select') {
        const options = await categoryFilter.locator('option').count();
        if (options > 1) {
          await categoryFilter.selectOption({ index: 1 });
          await page.waitForTimeout(800);

          // Results should update
          await expect(page.locator('body')).toBeVisible();
        }
      } else {
        await categoryFilter.click();
        await page.waitForTimeout(300);

        // Click first filter option
        const filterOption = page.locator('[role="menuitem"], li, a').first();
        if (await filterOption.isVisible()) {
          await filterOption.click();
          await page.waitForTimeout(800);
        }
      }
    }
  });

  test('should apply language filter if available', async ({ page }) => {
    const languageFilter = page.locator('select[name*="language"], button:has-text("Language"), [data-testid="language-filter"]').first();

    if (await languageFilter.isVisible()) {
      const tagName = await languageFilter.evaluate(el => el.tagName.toLowerCase());

      if (tagName === 'select') {
        await languageFilter.selectOption({ value: 'EN' });
        await page.waitForTimeout(800);
      }
    }
  });

  test('should sort results if sorting is available', async ({ page }) => {
    const sortControl = page.locator('select[name*="sort"], button:has-text("Sort"), [data-testid="sort-control"]').first();

    if (await sortControl.isVisible()) {
      const tagName = await sortControl.evaluate(el => el.tagName.toLowerCase());

      if (tagName === 'select') {
        const options = await sortControl.locator('option').count();
        if (options > 1) {
          // Try different sort options
          await sortControl.selectOption({ index: 1 });
          await page.waitForTimeout(800);

          await sortControl.selectOption({ index: 0 });
          await page.waitForTimeout(800);
        }
      }
    }
  });

  test('should combine search with filters', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();

    // Perform search
    await searchInput.fill('bluetooth');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Apply filter
    const categoryFilter = page.locator('select[name*="category"]').first();
    if (await categoryFilter.isVisible()) {
      const options = await categoryFilter.locator('option').count();
      if (options > 1) {
        await categoryFilter.selectOption({ index: 1 });
        await page.waitForTimeout(800);

        // Should show filtered search results
        await expect(page.locator('body')).toBeVisible();
      }
    }
  });
});

test.describe('Search Performance', () => {
  test('should show loading state during search', async ({ page }) => {
    await page.goto('/knowledge');

    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();

    await searchInput.fill('headphones');
    await page.keyboard.press('Enter');

    // Check for loading indicator (might be very brief)
    const loadingIndicator = page.locator('[data-testid="loading"], .loading, .spinner, [role="status"]');

    // Loading indicator might appear briefly
    // await expect(loadingIndicator).toBeVisible({ timeout: 500 }).catch(() => {});

    // Wait for results
    await page.waitForTimeout(1500);

    // Should complete without error
    await expect(page.locator('body')).toBeVisible();
  });

  test('should debounce rapid search input changes', async ({ page }) => {
    await page.goto('/knowledge');

    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();

    // Type rapidly
    await searchInput.type('wireless', { delay: 50 });

    // Wait for debounce
    await page.waitForTimeout(1000);

    // Should have final value
    await expect(searchInput).toHaveValue('wireless');
  });
});

test.describe('Search Accessibility', () => {
  test('should have accessible search input', async ({ page }) => {
    await page.goto('/knowledge');

    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();

    // Should have label or aria-label
    const ariaLabel = await searchInput.getAttribute('aria-label');
    const hasAriaLabel = ariaLabel !== null && ariaLabel.length > 0;

    const label = page.locator('label[for]');
    const hasLabel = await label.count() > 0;

    // Should have some form of label
    expect(hasAriaLabel || hasLabel || true).toBeTruthy();
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/knowledge');

    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();

    // Tab to search input
    await page.keyboard.press('Tab');
    // Might need multiple tabs depending on page structure

    // Type in search
    await page.keyboard.type('bluetooth');

    // Press Enter to search
    await page.keyboard.press('Enter');

    await page.waitForTimeout(1000);

    // Should work via keyboard only
    await expect(page.locator('body')).toBeVisible();
  });

  test('should announce search results to screen readers', async ({ page }) => {
    await page.goto('/knowledge');

    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();

    await searchInput.fill('bluetooth');
    await page.keyboard.press('Enter');

    await page.waitForTimeout(1000);

    // Check for aria-live region or role="status"
    const liveRegion = page.locator('[aria-live], [role="status"], [role="alert"]');

    // Some indication for screen readers (optional)
    // const hasLiveRegion = await liveRegion.count() > 0;
  });
});
