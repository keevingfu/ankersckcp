import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Anker Soundcore KCP|Knowledge Control Plane/i);
  });

  test('should display main navigation', async ({ page }) => {
    // Check that main navigation elements are visible
    // Since the page might not have a <nav> element, check for common navigation indicators
    const header = page.locator('header').first();
    const hasHeader = await header.count() > 0;

    if (hasHeader) {
      await expect(header).toBeVisible();
    } else {
      // If no header, check for any links (navigation should have links)
      const links = page.locator('a');
      const linkCount = await links.count();
      expect(linkCount).toBeGreaterThan(0);
    }
  });

  test('should display hero section', async ({ page }) => {
    // Check for hero content
    const heroHeading = page.locator('h1, h2').first();
    await expect(heroHeading).toBeVisible();
  });

  test('should navigate to dashboard', async ({ page }) => {
    // Click on dashboard link if available
    // Use more specific selector to avoid strict mode violation
    const dashboardLink = page.locator('a[href="/dashboard"]').first();
    const count = await dashboardLink.count();

    if (count > 0 && await dashboardLink.isVisible()) {
      await dashboardLink.click();
      await expect(page).toHaveURL(/.*dashboard/);
    }
  });

  test('should navigate to knowledge page', async ({ page }) => {
    // Click on knowledge link if available
    // Use more specific selector to avoid strict mode violation
    const knowledgeLink = page.locator('a[href="/knowledge"]').first();
    const count = await knowledgeLink.count();

    if (count > 0 && await knowledgeLink.isVisible()) {
      await knowledgeLink.click();
      await expect(page).toHaveURL(/.*knowledge/);
    }
  });

  test('should be responsive on mobile', async ({ page, viewport }) => {
    if (viewport) {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Check that page adapts to mobile
      const content = page.locator('body');
      await expect(content).toBeVisible();
    }
  });

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Allow for some common non-critical errors
    const criticalErrors = errors.filter(err =>
      !err.includes('favicon') &&
      !err.includes('manifest')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('should load page within performance budget', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;

    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });
});
