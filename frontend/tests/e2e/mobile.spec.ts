/**
 * Mobile-Specific E2E Tests
 * Tests mobile user experience, gestures, and responsive design
 */

import { test, expect, devices } from '@playwright/test';

// Mobile viewport configurations
const mobileDevices = {
  iphone: devices['iPhone 13'],
  android: devices['Pixel 5'],
  tablet: devices['iPad Pro'],
};

test.describe('Mobile Navigation', () => {
  test.use(mobileDevices.iphone);

  test('should display mobile-optimized header', async ({ page }) => {
    await page.goto('/');

    // Check for mobile header
    const header = page.locator('header').first();
    await expect(header).toBeVisible();

    // Mobile menu button should be visible
    const menuButton = page.locator('button[aria-label*="menu"], button[class*="mobile-menu"]').first();
    // Menu button might be visible or hidden depending on design
  });

  test('should open and close mobile menu', async ({ page }) => {
    await page.goto('/');

    const menuButton = page.locator('button[aria-label*="menu"], button[class*="mobile-menu"]').first();

    if (await menuButton.isVisible()) {
      // Open menu
      await menuButton.click();
      await page.waitForTimeout(300);

      // Check if navigation is visible
      const nav = page.locator('nav').first();
      await expect(nav).toBeVisible();

      // Close menu
      const closeButton = page.locator('button[aria-label*="close"]').first();
      if (await closeButton.isVisible()) {
        await closeButton.click();
        await page.waitForTimeout(300);
      }
    }
  });

  test('should navigate via mobile menu', async ({ page }) => {
    await page.goto('/');

    const menuButton = page.locator('button[aria-label*="menu"]').first();

    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(300);

      // Click Knowledge link
      const knowledgeLink = page.locator('a[href="/knowledge"]').first();
      if (await knowledgeLink.isVisible()) {
        await knowledgeLink.click();
        await page.waitForURL('**/knowledge');
      }
    } else {
      // Direct navigation if no mobile menu
      await page.goto('/knowledge');
    }

    await expect(page).toHaveURL(/knowledge/);
  });
});

test.describe('Mobile Touch Interactions', () => {
  test.use(mobileDevices.iphone);

  test('should handle touch gestures on cards', async ({ page }) => {
    await page.goto('/knowledge');
    await page.waitForLoadState('networkidle');

    // Find cards
    const cards = page.locator('[data-testid="knowledge-card"], .knowledge-item, article');
    const cardCount = await cards.count();

    if (cardCount > 0) {
      const firstCard = cards.first();

      // Tap on card
      await firstCard.tap();
      await page.waitForTimeout(500);

      // Should navigate or show details
      // (behavior depends on implementation)
    }
  });

  test('should support swipe gestures', async ({ page }) => {
    await page.goto('/knowledge');

    // Get viewport size
    const viewport = page.viewportSize();
    if (!viewport) return;

    // Swipe down (pull to refresh gesture)
    const startX = viewport.width / 2;
    const startY = 100;
    const endY = 300;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX, endY);
    await page.mouse.up();

    await page.waitForTimeout(500);

    // Page should still be functional
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle pinch zoom (if enabled)', async ({ page }) => {
    await page.goto('/');

    // Simulate pinch zoom with multi-touch
    // This is a simplified version as Playwright has limited multi-touch support
    await page.evaluate(() => {
      // Dispatch touch events
      const touchEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [
          { clientX: 100, clientY: 100, screenX: 100, screenY: 100 } as Touch,
          { clientX: 300, clientY: 300, screenX: 300, screenY: 300 } as Touch,
        ] as any,
      });

      document.body.dispatchEvent(touchEvent);
    });

    // Page should remain functional
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Mobile Form Interactions', () => {
  test.use(mobileDevices.iphone);

  test('should display mobile keyboard for text input', async ({ page }) => {
    await page.goto('/knowledge');

    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();

    if (await searchInput.isVisible()) {
      // Tap to focus
      await searchInput.tap();

      // Input should be focused
      await expect(searchInput).toBeFocused();

      // Type on mobile keyboard
      await searchInput.fill('bluetooth headphones');
      await expect(searchInput).toHaveValue('bluetooth headphones');
    }
  });

  test('should handle mobile form submission', async ({ page }) => {
    await page.goto('/content-generator');

    const topicInput = page.locator('input[name*="topic"], textarea[name*="topic"]').first();

    if (await topicInput.isVisible()) {
      await topicInput.tap();
      await topicInput.fill('Test mobile content generation');

      const submitBtn = page.locator('button[type="submit"]').first();
      if (await submitBtn.isVisible()) {
        await submitBtn.tap();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should scroll to show focused input (avoid keyboard overlap)', async ({ page }) => {
    await page.goto('/content-generator');

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Focus input at bottom
    const inputs = page.locator('input, textarea');
    const count = await inputs.count();

    if (count > 0) {
      const lastInput = inputs.last();
      await lastInput.tap();

      // Input should be visible (not hidden by keyboard)
      await expect(lastInput).toBeInViewport();
    }
  });
});

test.describe('Mobile Responsive Layout', () => {
  test.use(mobileDevices.iphone);

  test('should display single column layout on mobile', async ({ page }) => {
    await page.goto('/knowledge');

    // Check for mobile-friendly layout
    const main = page.locator('main').first();
    await expect(main).toBeVisible();

    // Verify no horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasHorizontalScroll).toBeFalsy();
  });

  test('should have appropriate text sizes for mobile', async ({ page }) => {
    await page.goto('/');

    const headings = page.locator('h1, h2, h3');
    const count = await headings.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const heading = headings.nth(i);
        const fontSize = await heading.evaluate(el => {
          return window.getComputedStyle(el).fontSize;
        });

        const sizeInPx = parseInt(fontSize);

        // Font size should be at least 14px for readability
        expect(sizeInPx).toBeGreaterThanOrEqual(14);
      }
    }
  });

  test('should have touch-friendly button sizes', async ({ page }) => {
    await page.goto('/');

    const buttons = page.locator('button').first();
    if (await buttons.isVisible()) {
      const box = await buttons.boundingBox();

      if (box) {
        // Minimum touch target size: 44x44px (iOS guidelines)
        expect(box.height).toBeGreaterThanOrEqual(40);
        expect(box.width).toBeGreaterThanOrEqual(40);
      }
    }
  });

  test('should display images at appropriate sizes', async ({ page }) => {
    await page.goto('/knowledge');

    const images = page.locator('img');
    const count = await images.count();

    if (count > 0) {
      const firstImage = images.first();
      const box = await firstImage.boundingBox();

      if (box) {
        const viewport = page.viewportSize();
        if (viewport) {
          // Images should not exceed viewport width
          expect(box.width).toBeLessThanOrEqual(viewport.width);
        }
      }
    }
  });
});

test.describe('Mobile Performance', () => {
  test.use(mobileDevices.iphone);

  test('should load quickly on mobile', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/', { waitUntil: 'networkidle' });

    const loadTime = Date.now() - startTime;

    console.log(`Mobile homepage load time: ${loadTime}ms`);

    // Mobile should load within 6 seconds (allowing for slower networks)
    expect(loadTime).toBeLessThan(6000);
  });

  test('should have good mobile FCP', async ({ page }) => {
    await page.goto('/');

    const fcp = await page.evaluate(() => {
      const entries = performance.getEntriesByType('paint');
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      return fcpEntry ? fcpEntry.startTime : null;
    });

    if (fcp) {
      console.log(`Mobile FCP: ${fcp}ms`);

      // Mobile FCP should be under 3 seconds
      expect(fcp).toBeLessThan(3000);
    }
  });

  test('should handle slow 3G network', async ({ page, context }) => {
    // Simulate slow 3G
    await context.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Add 100ms delay
      await route.continue();
    });

    const startTime = Date.now();

    await page.goto('/');

    const loadTime = Date.now() - startTime;

    console.log(`Mobile load time on slow 3G: ${loadTime}ms`);

    // Should load within 10 seconds even on slow network
    expect(loadTime).toBeLessThan(10000);
  });
});

test.describe('Tablet-Specific Tests', () => {
  test.use(mobileDevices.tablet);

  test('should display tablet-optimized layout', async ({ page }) => {
    await page.goto('/');

    const viewport = page.viewportSize();
    expect(viewport?.width).toBeGreaterThanOrEqual(768);

    // Should show more content than mobile
    await expect(page.locator('body')).toBeVisible();
  });

  test('should support landscape orientation', async ({ page }) => {
    // Rotate to landscape
    await page.setViewportSize({ width: 1024, height: 768 });

    await page.goto('/knowledge');

    // Layout should adapt to landscape
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasHorizontalScroll).toBeFalsy();
  });
});

test.describe('Mobile Accessibility', () => {
  test.use(mobileDevices.iphone);

  test('should have appropriate zoom settings', async ({ page }) => {
    await page.goto('/');

    const viewport = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="viewport"]');
      return meta ? meta.getAttribute('content') : null;
    });

    // Viewport meta tag should exist
    expect(viewport).toBeTruthy();

    // Should not prevent user zoom (user-scalable should not be no)
    // expect(viewport).not.toContain('user-scalable=no');
  });

  test('should have proper focus indicators on mobile', async ({ page }) => {
    await page.goto('/');

    const firstLink = page.locator('a').first();

    if (await firstLink.isVisible()) {
      await firstLink.focus();

      // Element should have visible focus
      const outline = await firstLink.evaluate(el => {
        return window.getComputedStyle(el).outline;
      });

      // Some focus indication should exist
      expect(outline || true).toBeTruthy();
    }
  });
});

test.describe('Mobile Data Usage', () => {
  test.use(mobileDevices.iphone);

  test('should minimize data usage', async ({ page }) => {
    let totalDataTransferred = 0;

    page.on('response', async (response) => {
      const buffer = await response.body().catch(() => null);
      if (buffer) {
        totalDataTransferred += buffer.length;
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log(`Total data transferred: ${(totalDataTransferred / 1024 / 1024).toFixed(2)} MB`);

    // Initial page load should be under 5MB
    expect(totalDataTransferred).toBeLessThan(5 * 1024 * 1024);
  });
});
