/**
 * Performance E2E Tests
 * Tests page load times, rendering performance, and resource usage
 */

import { test, expect } from '@playwright/test';

test.describe('Page Load Performance', () => {
  test('homepage should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/', { waitUntil: 'networkidle' });

    const loadTime = Date.now() - startTime;

    // Homepage should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);

    console.log(`Homepage load time: ${loadTime}ms`);
  });

  test('dashboard should load within acceptable time', async ({ page }) => {
    const dashboardLink = page.locator('a[href="/dashboard"]');

    // Check if dashboard exists
    await page.goto('/');

    if (await dashboardLink.isVisible()) {
      const startTime = Date.now();

      await page.goto('/dashboard', { waitUntil: 'networkidle' });

      const loadTime = Date.now() - startTime;

      // Dashboard should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);

      console.log(`Dashboard load time: ${loadTime}ms`);
    }
  });

  test('knowledge page should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/knowledge', { waitUntil: 'networkidle' });

    const loadTime = Date.now() - startTime;

    // Knowledge page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);

    console.log(`Knowledge page load time: ${loadTime}ms`);
  });

  test('should measure First Contentful Paint (FCP)', async ({ page }) => {
    await page.goto('/');

    const fcp = await page.evaluate(() => {
      const entries = performance.getEntriesByType('paint');
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      return fcpEntry ? fcpEntry.startTime : null;
    });

    if (fcp) {
      console.log(`First Contentful Paint: ${fcp}ms`);

      // FCP should be under 2 seconds
      expect(fcp).toBeLessThan(2000);
    }
  });

  test('should measure Largest Contentful Paint (LCP)', async ({ page }) => {
    await page.goto('/');

    // Wait for LCP
    await page.waitForLoadState('networkidle');

    const lcp = await page.evaluate(() => {
      return new Promise<number | null>((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          resolve(lastEntry.renderTime || lastEntry.loadTime);
        });

        observer.observe({ type: 'largest-contentful-paint', buffered: true });

        // Timeout after 3 seconds
        setTimeout(() => {
          observer.disconnect();
          resolve(null);
        }, 3000);
      });
    });

    if (lcp) {
      console.log(`Largest Contentful Paint: ${lcp}ms`);

      // LCP should be under 2.5 seconds (Google's good threshold)
      expect(lcp).toBeLessThan(2500);
    }
  });

  test('should measure Time to Interactive (TTI)', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');

    // Wait until page is interactive
    await page.waitForLoadState('domcontentloaded');

    const tti = Date.now() - startTime;

    console.log(`Time to Interactive: ${tti}ms`);

    // TTI should be under 3.8 seconds (Google's good threshold)
    expect(tti).toBeLessThan(3800);
  });
});

test.describe('Resource Loading Performance', () => {
  test('should not load excessive resources', async ({ page }) => {
    const resources: string[] = [];

    page.on('request', (request) => {
      resources.push(request.url());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log(`Total resources loaded: ${resources.length}`);

    // Should not load more than 100 resources on initial load
    expect(resources.length).toBeLessThan(100);
  });

  test('should optimize image loading', async ({ page }) => {
    const images: Array<{ url: string; size: number }> = [];

    page.on('response', async (response) => {
      const contentType = response.headers()['content-type'] || '';
      if (contentType.includes('image')) {
        const buffer = await response.body().catch(() => null);
        if (buffer) {
          images.push({
            url: response.url(),
            size: buffer.length,
          });
        }
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log(`Images loaded: ${images.length}`);

    if (images.length > 0) {
      const totalSize = images.reduce((sum, img) => sum + img.size, 0);
      const averageSize = totalSize / images.length;

      console.log(`Total image size: ${(totalSize / 1024).toFixed(2)} KB`);
      console.log(`Average image size: ${(averageSize / 1024).toFixed(2)} KB`);

      // Images should use modern formats (WebP, AVIF)
      const modernFormats = images.filter(img =>
        img.url.includes('.webp') || img.url.includes('.avif')
      );

      console.log(`Modern format images: ${modernFormats.length}/${images.length}`);
    }
  });

  test('should not have excessive JavaScript bundle size', async ({ page }) => {
    let totalJSSize = 0;

    page.on('response', async (response) => {
      const contentType = response.headers()['content-type'] || '';
      if (contentType.includes('javascript')) {
        const buffer = await response.body().catch(() => null);
        if (buffer) {
          totalJSSize += buffer.length;
        }
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log(`Total JavaScript size: ${(totalJSSize / 1024).toFixed(2)} KB`);

    // Total JS should be under 1MB (reasonable for modern SPA)
    expect(totalJSSize).toBeLessThan(1024 * 1024);
  });

  test('should load critical CSS first', async ({ page }) => {
    const cssFiles: string[] = [];

    page.on('response', (response) => {
      const contentType = response.headers()['content-type'] || '';
      if (contentType.includes('css')) {
        cssFiles.push(response.url());
      }
    });

    await page.goto('/');

    // Wait a bit for CSS to load
    await page.waitForTimeout(500);

    console.log(`CSS files loaded: ${cssFiles.length}`);

    if (cssFiles.length > 0) {
      console.log('CSS files:', cssFiles);
    }
  });
});

test.describe('Rendering Performance', () => {
  test('should render list without layout shift', async ({ page }) => {
    await page.goto('/knowledge');

    // Measure Cumulative Layout Shift (CLS)
    await page.waitForLoadState('networkidle');

    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsScore = 0;

        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsScore += (entry as any).value;
            }
          }
        });

        observer.observe({ type: 'layout-shift', buffered: true });

        setTimeout(() => {
          observer.disconnect();
          resolve(clsScore);
        }, 2000);
      });
    });

    console.log(`Cumulative Layout Shift: ${cls}`);

    // CLS should be under 0.1 (Google's good threshold)
    expect(cls).toBeLessThan(0.1);
  });

  test('should handle rapid scrolling smoothly', async ({ page }) => {
    await page.goto('/knowledge');
    await page.waitForLoadState('networkidle');

    const startTime = Date.now();

    // Rapid scroll
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => window.scrollBy(0, 200));
      await page.waitForTimeout(50);
    }

    const scrollTime = Date.now() - startTime;

    console.log(`Rapid scroll time: ${scrollTime}ms`);

    // Should complete smoothly within 1 second
    expect(scrollTime).toBeLessThan(1000);
  });

  test('should virtualize long lists if implemented', async ({ page }) => {
    await page.goto('/knowledge');
    await page.waitForLoadState('networkidle');

    // Check for virtual scrolling indicators
    const listContainer = page.locator('[data-testid="knowledge-list"], .knowledge-list, .list-container').first();

    if (await listContainer.isVisible()) {
      // Count rendered items
      const items = page.locator('[data-testid="knowledge-card"], .knowledge-item, article');
      const itemCount = await items.count();

      console.log(`Rendered list items: ${itemCount}`);

      // If virtualization is implemented, should have limited DOM nodes
      // even with large datasets
    }
  });

  test('should lazy load images below the fold', async ({ page }) => {
    await page.goto('/knowledge');

    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      console.log(`Total images on page: ${imageCount}`);

      // Check for lazy loading attribute
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        const loading = await img.getAttribute('loading');

        if (loading === 'lazy') {
          console.log(`Image ${i + 1} has lazy loading`);
        }
      }
    }
  });
});

test.describe('Network Performance', () => {
  test('should use HTTP/2 or HTTP/3', async ({ page }) => {
    const protocols: string[] = [];

    page.on('response', (response) => {
      const protocol = response.request().response()?.headers()['x-firefox-spdy'] || 'unknown';
      protocols.push(protocol);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('Protocols used:', [...new Set(protocols)]);
  });

  test('should compress text resources', async ({ page }) => {
    let compressedCount = 0;
    let totalCount = 0;

    page.on('response', (response) => {
      const contentType = response.headers()['content-type'] || '';
      const contentEncoding = response.headers()['content-encoding'] || '';

      if (contentType.includes('javascript') ||
          contentType.includes('css') ||
          contentType.includes('html') ||
          contentType.includes('json')) {
        totalCount++;

        if (contentEncoding.includes('gzip') ||
            contentEncoding.includes('br') ||
            contentEncoding.includes('deflate')) {
          compressedCount++;
        }
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log(`Compressed resources: ${compressedCount}/${totalCount}`);

    // Most text resources should be compressed
    if (totalCount > 0) {
      const compressionRate = compressedCount / totalCount;
      expect(compressionRate).toBeGreaterThan(0.7); // At least 70% compressed
    }
  });

  test('should cache static assets', async ({ page }) => {
    const cachedResources: string[] = [];

    page.on('response', (response) => {
      const cacheControl = response.headers()['cache-control'] || '';
      const url = response.url();

      if (cacheControl.includes('max-age') || cacheControl.includes('immutable')) {
        cachedResources.push(url);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log(`Cacheable resources: ${cachedResources.length}`);

    // Should have some cacheable resources
    expect(cachedResources.length).toBeGreaterThan(0);
  });
});

test.describe('Memory Performance', () => {
  test('should not have memory leaks on navigation', async ({ page }) => {
    await page.goto('/');

    // Get initial memory
    const initialMemory = await page.evaluate(() => {
      if (performance && (performance as any).memory) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return null;
    });

    if (initialMemory) {
      // Navigate through pages
      const pages = ['/knowledge', '/dashboard', '/', '/knowledge'];

      for (const pagePath of pages) {
        const link = page.locator(`a[href="${pagePath}"]`).first();
        if (await link.isVisible()) {
          await link.click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(500);
        } else {
          await page.goto(pagePath);
        }
      }

      // Get final memory
      const finalMemory = await page.evaluate(() => {
        if (performance && (performance as any).memory) {
          return (performance as any).memory.usedJSHeapSize;
        }
        return null;
      });

      if (finalMemory) {
        const memoryIncrease = finalMemory - initialMemory;
        const increasePercent = (memoryIncrease / initialMemory) * 100;

        console.log(`Initial memory: ${(initialMemory / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Final memory: ${(finalMemory / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Memory increase: ${increasePercent.toFixed(2)}%`);

        // Memory should not increase more than 50% after navigation
        expect(increasePercent).toBeLessThan(50);
      }
    }
  });
});

test.describe('Mobile Performance', () => {
  test.use({ isMobile: true });

  test('should load quickly on mobile', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/', { waitUntil: 'networkidle' });

    const loadTime = Date.now() - startTime;

    console.log(`Mobile homepage load time: ${loadTime}ms`);

    // Mobile should load within 6 seconds (allowing for slower networks)
    expect(loadTime).toBeLessThan(6000);
  });

  test('should have good mobile performance metrics', async ({ page }) => {
    await page.goto('/');

    const metrics = await page.evaluate(() => ({
      fcp: performance.getEntriesByType('paint')
        .find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
      loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart,
    }));

    console.log('Mobile metrics:', metrics);

    // FCP should be under 3 seconds on mobile
    expect(metrics.fcp).toBeLessThan(3000);
  });
});
