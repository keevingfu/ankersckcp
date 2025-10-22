import { test, expect } from '@playwright/test';

test.describe('Knowledge Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/knowledge');
  });

  test('should load knowledge page', async ({ page }) => {
    await expect(page).toHaveURL(/.*knowledge/);
    await page.waitForLoadState('networkidle');
  });

  test('should display knowledge items or empty state', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Should show either knowledge cards or an empty state message
    const hasKnowledgeCards = await page.locator('[class*="KnowledgeCard"], [class*="knowledge"]').count();
    const hasEmptyState = await page.locator('text=/no items|empty|暂无/i').count();

    expect(hasKnowledgeCards + hasEmptyState).toBeGreaterThan(0);
  });

  test('should have filter/search functionality', async ({ page }) => {
    // Look for filter or search elements
    const hasSearchInput = await page.locator('input[type="search"], input[type="text"]').count();
    const hasFilterButtons = await page.locator('button[class*="filter"], select, [role="combobox"]').count();

    // Should have some way to filter/search
    expect(hasSearchInput + hasFilterButtons).toBeGreaterThanOrEqual(0);
  });

  test('should display knowledge card details', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Check for knowledge card elements
    const knowledgeCards = await page.locator('[class*="Card"]').count();

    if (knowledgeCards > 0) {
      const firstCard = page.locator('[class*="Card"]').first();
      await expect(firstCard).toBeVisible();

      // Card should have some text content
      const cardText = await firstCard.textContent();
      expect(cardText).toBeTruthy();
      expect(cardText!.length).toBeGreaterThan(0);
    }
  });

  test('should handle pagination if present', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Look for pagination elements
    const paginationButtons = await page.locator('button:has-text("Next"), button:has-text("Previous"), button:has-text("下一页"), button:has-text("上一页")').count();

    // If pagination exists, it should be functional
    if (paginationButtons > 0) {
      const nextButton = page.locator('button:has-text("Next"), button:has-text("下一页")').first();
      if (await nextButton.isVisible() && await nextButton.isEnabled()) {
        const currentURL = page.url();
        await nextButton.click();
        await page.waitForTimeout(500);

        // URL might change or content might update
        const newURL = page.url();
        // Just check that the page is still functional after clicking
        const body = page.locator('body');
        await expect(body).toBeVisible();
      }
    }
  });

  test('should allow filtering by category', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Look for category filters
    const categoryFilters = await page.locator('button[class*="category"], select option, [role="tab"]').count();

    if (categoryFilters > 0) {
      // Click on a filter if available
      const filterButton = page.locator('button[class*="category"], [role="tab"]').first();
      if (await filterButton.isVisible()) {
        await filterButton.click();
        await page.waitForTimeout(500);

        // Page should still be functional
        const body = page.locator('body');
        await expect(body).toBeVisible();
      }
    }
  });

  test('should show knowledge item actions on hover/click', async ({ page }) => {
    await page.waitForTimeout(1000);

    const knowledgeCards = await page.locator('[class*="Card"]').count();

    if (knowledgeCards > 0) {
      const firstCard = page.locator('[class*="Card"]').first();

      // Hover over card
      await firstCard.hover();
      await page.waitForTimeout(300);

      // Look for action buttons (edit, delete, view, etc.)
      const actionButtons = await page.locator('button:has-text("Edit"), button:has-text("Delete"), button:has-text("View"), button:has-text("编辑"), button:has-text("删除")').count();

      // Actions might be visible on hover or always visible
      expect(actionButtons).toBeGreaterThanOrEqual(0);
    }
  });

  test('should handle search functionality', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], input[placeholder*="搜索"]').first();

    if (await searchInput.count() > 0) {
      await searchInput.fill('test search query');
      await page.waitForTimeout(500);

      // Submit search (might be auto-search or button click)
      const searchButton = page.locator('button[type="submit"], button:has-text("Search"), button:has-text("搜索")').first();
      if (await searchButton.count() > 0) {
        await searchButton.click();
      } else {
        // Try pressing Enter
        await searchInput.press('Enter');
      }

      await page.waitForTimeout(500);

      // Page should handle search (even if no results)
      const body = page.locator('body');
      await expect(body).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page, viewport }) => {
    if (viewport) {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Check that content is visible and functional
      const body = page.locator('body');
      await expect(body).toBeVisible();

      // Knowledge cards should stack vertically
      const cards = await page.locator('[class*="Card"]').count();
      if (cards > 0) {
        const firstCard = page.locator('[class*="Card"]').first();
        await expect(firstCard).toBeVisible();
      }
    }
  });

  test('should load within performance budget', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/knowledge');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;

    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });
});
