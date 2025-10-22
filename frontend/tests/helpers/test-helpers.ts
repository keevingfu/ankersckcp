/**
 * Test Helper Functions
 * Reusable functions for E2E tests
 */

import { Page, expect } from '@playwright/test';
import { testSelectors, testTimings } from '../fixtures/test-data';

/**
 * Navigation Helpers
 */

export async function navigateToPage(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
}

export async function navigateViaLink(page: Page, href: string) {
  const link = page.locator(`a[href="${href}"]`).first();

  if (await link.isVisible()) {
    await link.click();
    await page.waitForURL(`**${href}`);
  } else {
    await page.goto(href);
  }
}

export async function goBack(page: Page) {
  await page.goBack();
  await page.waitForLoadState('networkidle');
}

export async function refreshPage(page: Page) {
  await page.reload();
  await page.waitForLoadState('networkidle');
}

/**
 * Search Helpers
 */

export async function performSearch(page: Page, query: string) {
  const searchInput = page.locator(testSelectors.search.input).first();

  if (await searchInput.isVisible()) {
    await searchInput.fill(query);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(testTimings.medium);
    return true;
  }

  return false;
}

export async function clearSearch(page: Page) {
  const searchInput = page.locator(testSelectors.search.input).first();

  if (await searchInput.isVisible()) {
    await searchInput.clear();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(testTimings.short);
  }
}

export async function getSearchResults(page: Page) {
  const results = page.locator(testSelectors.search.results);
  return await results.count();
}

export async function hasEmptyState(page: Page) {
  const emptyState = page.locator(testSelectors.search.emptyState);
  return await emptyState.isVisible();
}

/**
 * Form Helpers
 */

export async function fillForm(page: Page, formData: Record<string, string>) {
  for (const [key, value] of Object.entries(formData)) {
    const input = page.locator(`input[name="${key}"], textarea[name="${key}"], select[name="${key}"]`).first();

    if (await input.isVisible()) {
      const tagName = await input.evaluate(el => el.tagName.toLowerCase());

      if (tagName === 'select') {
        await input.selectOption({ label: value });
      } else {
        await input.fill(value);
      }
    }
  }
}

export async function submitForm(page: Page) {
  const submitBtn = page.locator(testSelectors.forms.submit).first();

  if (await submitBtn.isVisible() && await submitBtn.isEnabled()) {
    await submitBtn.click();
    await page.waitForTimeout(testTimings.long);
    return true;
  }

  return false;
}

export async function clearForm(page: Page) {
  const clearBtn = page.locator(testSelectors.forms.clear).first();

  if (await clearBtn.isVisible()) {
    await clearBtn.click();
    await page.waitForTimeout(testTimings.short);
  }
}

/**
 * Chat Helpers
 */

export async function sendChatMessage(page: Page, message: string) {
  const chatInput = page.locator(testSelectors.chat.input).last();
  const sendBtn = page.locator(testSelectors.chat.send).last();

  if (await chatInput.isVisible()) {
    await chatInput.fill(message);

    if (await sendBtn.isVisible() && await sendBtn.isEnabled()) {
      await sendBtn.click();
      await page.waitForTimeout(testTimings.long);
      return true;
    }
  }

  return false;
}

export async function getChatMessages(page: Page) {
  const messages = page.locator(testSelectors.chat.messages);
  return await messages.count();
}

export async function getLastChatMessage(page: Page) {
  const messages = page.locator(testSelectors.chat.messages);
  const count = await messages.count();

  if (count > 0) {
    return await messages.nth(count - 1).textContent();
  }

  return null;
}

/**
 * Waiting Helpers
 */

export async function waitForElement(page: Page, selector: string, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch {
    return false;
  }
}

export async function waitForText(page: Page, text: string | RegExp, timeout = 5000) {
  try {
    await page.waitForSelector(`text=${text instanceof RegExp ? text.source : text}`, { timeout });
    return true;
  } catch {
    return false;
  }
}

export async function waitForNavigation(page: Page, url: string | RegExp) {
  await page.waitForURL(url);
}

export async function waitForRequest(page: Page, urlPattern: string | RegExp) {
  return await page.waitForRequest(urlPattern);
}

export async function waitForResponse(page: Page, urlPattern: string | RegExp) {
  return await page.waitForResponse(urlPattern);
}

/**
 * Visibility Helpers
 */

export async function isElementVisible(page: Page, selector: string) {
  const element = page.locator(selector).first();
  return await element.isVisible().catch(() => false);
}

export async function isElementEnabled(page: Page, selector: string) {
  const element = page.locator(selector).first();
  return await element.isEnabled().catch(() => false);
}

export async function getElementText(page: Page, selector: string) {
  const element = page.locator(selector).first();
  return await element.textContent().catch(() => null);
}

export async function getElementCount(page: Page, selector: string) {
  const elements = page.locator(selector);
  return await elements.count();
}

/**
 * Interaction Helpers
 */

export async function clickElement(page: Page, selector: string) {
  const element = page.locator(selector).first();

  if (await element.isVisible()) {
    await element.click();
    await page.waitForTimeout(testTimings.short);
    return true;
  }

  return false;
}

export async function hoverElement(page: Page, selector: string) {
  const element = page.locator(selector).first();

  if (await element.isVisible()) {
    await element.hover();
    await page.waitForTimeout(testTimings.short);
    return true;
  }

  return false;
}

export async function scrollToElement(page: Page, selector: string) {
  const element = page.locator(selector).first();

  if (await element.isVisible()) {
    await element.scrollIntoViewIfNeeded();
    await page.waitForTimeout(testTimings.short);
    return true;
  }

  return false;
}

export async function scrollToPosition(page: Page, x: number, y: number) {
  await page.evaluate(({ x, y }) => window.scrollTo(x, y), { x, y });
  await page.waitForTimeout(testTimings.short);
}

export async function scrollToBottom(page: Page) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(testTimings.short);
}

export async function scrollToTop(page: Page) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(testTimings.short);
}

/**
 * Screenshot Helpers
 */

export async function takeScreenshot(page: Page, filename: string) {
  await page.screenshot({ path: `screenshots/${filename}.png`, fullPage: true });
}

export async function takeElementScreenshot(page: Page, selector: string, filename: string) {
  const element = page.locator(selector).first();

  if (await element.isVisible()) {
    await element.screenshot({ path: `screenshots/${filename}.png` });
  }
}

/**
 * Assertion Helpers
 */

export async function assertPageTitle(page: Page, title: string | RegExp) {
  await expect(page).toHaveTitle(title);
}

export async function assertURL(page: Page, url: string | RegExp) {
  await expect(page).toHaveURL(url);
}

export async function assertElementVisible(page: Page, selector: string) {
  await expect(page.locator(selector).first()).toBeVisible();
}

export async function assertElementHidden(page: Page, selector: string) {
  await expect(page.locator(selector).first()).toBeHidden();
}

export async function assertElementText(page: Page, selector: string, text: string | RegExp) {
  await expect(page.locator(selector).first()).toContainText(text);
}

export async function assertElementCount(page: Page, selector: string, count: number) {
  await expect(page.locator(selector)).toHaveCount(count);
}

export async function assertInputValue(page: Page, selector: string, value: string) {
  await expect(page.locator(selector).first()).toHaveValue(value);
}

/**
 * Performance Helpers
 */

export async function measurePageLoadTime(page: Page, url: string) {
  const startTime = Date.now();
  await page.goto(url, { waitUntil: 'networkidle' });
  const loadTime = Date.now() - startTime;

  return {
    loadTime,
    url,
    timestamp: new Date().toISOString(),
  };
}

export async function getPerformanceMetrics(page: Page) {
  return await page.evaluate(() => {
    const paint = performance.getEntriesByType('paint');
    const fcp = paint.find(entry => entry.name === 'first-contentful-paint');

    return {
      fcp: fcp ? fcp.startTime : null,
      domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
      loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart,
    };
  });
}

export async function getMemoryUsage(page: Page) {
  return await page.evaluate(() => {
    if (performance && (performance as any).memory) {
      return {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
      };
    }
    return null;
  });
}

/**
 * Local Storage Helpers
 */

export async function setLocalStorage(page: Page, key: string, value: string) {
  await page.evaluate(({ key, value }) => {
    localStorage.setItem(key, value);
  }, { key, value });
}

export async function getLocalStorage(page: Page, key: string) {
  return await page.evaluate((key) => {
    return localStorage.getItem(key);
  }, key);
}

export async function clearLocalStorage(page: Page) {
  await page.evaluate(() => {
    localStorage.clear();
  });
}

/**
 * Network Helpers
 */

export async function mockAPIResponse(page: Page, urlPattern: string, responseData: any) {
  await page.route(urlPattern, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(responseData),
    });
  });
}

export async function mockAPIError(page: Page, urlPattern: string, statusCode = 500) {
  await page.route(urlPattern, (route) => {
    route.fulfill({
      status: statusCode,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Mocked error' }),
    });
  });
}

export async function interceptRequest(page: Page, urlPattern: string, callback: (request: any) => void) {
  page.on('request', (request) => {
    if (request.url().match(urlPattern)) {
      callback(request);
    }
  });
}

export async function interceptResponse(page: Page, urlPattern: string, callback: (response: any) => void) {
  page.on('response', (response) => {
    if (response.url().match(urlPattern)) {
      callback(response);
    }
  });
}

/**
 * Accessibility Helpers
 */

export async function checkAccessibility(page: Page) {
  // Basic accessibility checks
  const checks = {
    hasHeading: await page.locator('h1, h2, h3').count() > 0,
    hasLandmarks: await page.locator('[role="navigation"], [role="main"], [role="complementary"]').count() > 0,
    imagesHaveAlt: await checkImagesHaveAlt(page),
    linksHaveText: await checkLinksHaveText(page),
  };

  return checks;
}

async function checkImagesHaveAlt(page: Page) {
  const images = page.locator('img');
  const count = await images.count();

  if (count === 0) return true;

  for (let i = 0; i < count; i++) {
    const img = images.nth(i);
    const alt = await img.getAttribute('alt');

    if (alt === null) {
      return false;
    }
  }

  return true;
}

async function checkLinksHaveText(page: Page) {
  const links = page.locator('a');
  const count = await links.count();

  if (count === 0) return true;

  for (let i = 0; i < Math.min(count, 10); i++) {
    const link = links.nth(i);
    const text = await link.textContent();
    const ariaLabel = await link.getAttribute('aria-label');

    if (!text?.trim() && !ariaLabel) {
      return false;
    }
  }

  return true;
}

/**
 * Mobile Helpers
 */

export async function setMobileViewport(page: Page) {
  await page.setViewportSize({ width: 375, height: 667 });
}

export async function setTabletViewport(page: Page) {
  await page.setViewportSize({ width: 768, height: 1024 });
}

export async function setDesktopViewport(page: Page) {
  await page.setViewportSize({ width: 1920, height: 1080 });
}

export async function swipe(page: Page, direction: 'left' | 'right' | 'up' | 'down') {
  const viewport = page.viewportSize();
  if (!viewport) return;

  const startX = viewport.width / 2;
  const startY = viewport.height / 2;

  let endX = startX;
  let endY = startY;

  switch (direction) {
    case 'left':
      endX = startX - 200;
      break;
    case 'right':
      endX = startX + 200;
      break;
    case 'up':
      endY = startY - 200;
      break;
    case 'down':
      endY = startY + 200;
      break;
  }

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(endX, endY);
  await page.mouse.up();
}
