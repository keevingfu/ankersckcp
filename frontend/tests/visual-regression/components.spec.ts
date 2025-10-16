import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests for UI Components
 *
 * These tests capture screenshots of components and compare them against baseline images.
 * Run with: npx playwright test tests/visual-regression/
 */

const COMPONENTS_URL = 'http://localhost:3000';

test.describe('Button Component Visual Tests', () => {
  test('should match button variants', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/components/button`);

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Screenshot all button variants
    const buttonContainer = page.locator('[data-testid="button-variants"]');
    await expect(buttonContainer).toHaveScreenshot('button-variants.png', {
      maxDiffPixels: 100,
    });
  });

  test('should match button sizes', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/components/button`);

    const sizeContainer = page.locator('[data-testid="button-sizes"]');
    await expect(sizeContainer).toHaveScreenshot('button-sizes.png', {
      maxDiffPixels: 100,
    });
  });

  test('should match button states', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/components/button`);

    // Normal state
    const normalButton = page.locator('[data-testid="button-normal"]');
    await expect(normalButton).toHaveScreenshot('button-normal.png');

    // Hover state
    await normalButton.hover();
    await expect(normalButton).toHaveScreenshot('button-hover.png');

    // Loading state
    const loadingButton = page.locator('[data-testid="button-loading"]');
    await expect(loadingButton).toHaveScreenshot('button-loading.png');

    // Disabled state
    const disabledButton = page.locator('[data-testid="button-disabled"]');
    await expect(disabledButton).toHaveScreenshot('button-disabled.png');
  });
});

test.describe('Input Component Visual Tests', () => {
  test('should match input variants', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/components/input`);

    const inputContainer = page.locator('[data-testid="input-variants"]');
    await expect(inputContainer).toHaveScreenshot('input-variants.png', {
      maxDiffPixels: 100,
    });
  });

  test('should match input states', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/components/input`);

    // Default state
    const defaultInput = page.locator('[data-testid="input-default"]');
    await expect(defaultInput).toHaveScreenshot('input-default.png');

    // Focus state
    await defaultInput.click();
    await expect(defaultInput).toHaveScreenshot('input-focus.png');

    // Error state
    const errorInput = page.locator('[data-testid="input-error"]');
    await expect(errorInput).toHaveScreenshot('input-error.png');

    // Success state
    const successInput = page.locator('[data-testid="input-success"]');
    await expect(successInput).toHaveScreenshot('input-success.png');
  });
});

test.describe('Card Component Visual Tests', () => {
  test('should match card variants', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/components/card`);

    const cardContainer = page.locator('[data-testid="card-variants"]');
    await expect(cardContainer).toHaveScreenshot('card-variants.png', {
      maxDiffPixels: 100,
    });
  });

  test('should match stat card', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/components/card`);

    const statCardContainer = page.locator('[data-testid="stat-cards"]');
    await expect(statCardContainer).toHaveScreenshot('stat-cards.png', {
      maxDiffPixels: 100,
    });
  });

  test('should match card hover state', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/components/card`);

    const hoverableCard = page.locator('[data-testid="card-hoverable"]');

    // Normal state
    await expect(hoverableCard).toHaveScreenshot('card-normal.png');

    // Hover state
    await hoverableCard.hover();
    await page.waitForTimeout(300); // Wait for transition
    await expect(hoverableCard).toHaveScreenshot('card-hover.png');
  });
});

test.describe('Modal Component Visual Tests', () => {
  test('should match modal sizes', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/components/modal`);

    // Open small modal
    await page.click('[data-testid="open-modal-small"]');
    await page.waitForTimeout(300); // Wait for animation
    await expect(page).toHaveScreenshot('modal-small.png');
    await page.click('[data-testid="modal-close"]');

    // Open medium modal
    await page.click('[data-testid="open-modal-medium"]');
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('modal-medium.png');
    await page.click('[data-testid="modal-close"]');

    // Open large modal
    await page.click('[data-testid="open-modal-large"]');
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('modal-large.png');
  });

  test('should match confirm modal', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/components/modal`);

    // Open confirm modal (danger type)
    await page.click('[data-testid="open-confirm-modal"]');
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('confirm-modal-danger.png');
  });
});

test.describe('Table Component Visual Tests', () => {
  test('should match table layout', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/components/table`);

    const tableContainer = page.locator('[data-testid="table-basic"]');
    await expect(tableContainer).toHaveScreenshot('table-basic.png', {
      maxDiffPixels: 200,
    });
  });

  test('should match table with row selection', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/components/table`);

    const selectableTable = page.locator('[data-testid="table-selectable"]');

    // Select first row
    await page.click('[data-testid="row-checkbox-0"]');
    await expect(selectableTable).toHaveScreenshot('table-selected.png', {
      maxDiffPixels: 200,
    });
  });

  test('should match table sorted state', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/components/table`);

    const sortableTable = page.locator('[data-testid="table-sortable"]');

    // Click sort header
    await page.click('[data-testid="sort-header-title"]');
    await page.waitForTimeout(200);
    await expect(sortableTable).toHaveScreenshot('table-sorted.png', {
      maxDiffPixels: 200,
    });
  });
});

test.describe('Tabs Component Visual Tests', () => {
  test('should match tabs line variant', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/components/tabs`);

    const tabsContainer = page.locator('[data-testid="tabs-line"]');
    await expect(tabsContainer).toHaveScreenshot('tabs-line.png', {
      maxDiffPixels: 100,
    });

    // Click second tab
    await page.click('[data-testid="tab-2"]');
    await page.waitForTimeout(200);
    await expect(tabsContainer).toHaveScreenshot('tabs-line-active-2.png', {
      maxDiffPixels: 100,
    });
  });

  test('should match tabs card variant', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/components/tabs`);

    const tabsCard = page.locator('[data-testid="tabs-card"]');
    await expect(tabsCard).toHaveScreenshot('tabs-card.png', {
      maxDiffPixels: 100,
    });
  });

  test('should match tabs pill variant', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/components/tabs`);

    const tabsPill = page.locator('[data-testid="tabs-pill"]');
    await expect(tabsPill).toHaveScreenshot('tabs-pill.png', {
      maxDiffPixels: 100,
    });
  });
});

test.describe('Dropdown Component Visual Tests', () => {
  test('should match dropdown closed state', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/components/dropdown`);

    const dropdown = page.locator('[data-testid="dropdown-basic"]');
    await expect(dropdown).toHaveScreenshot('dropdown-closed.png');
  });

  test('should match dropdown open state', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/components/dropdown`);

    // Open dropdown
    await page.click('[data-testid="dropdown-trigger"]');
    await page.waitForTimeout(200); // Wait for animation
    await expect(page).toHaveScreenshot('dropdown-open.png');
  });

  test('should match dropdown with icons and dividers', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/components/dropdown`);

    // Open dropdown with complex items
    await page.click('[data-testid="dropdown-complex-trigger"]');
    await page.waitForTimeout(200);
    await expect(page).toHaveScreenshot('dropdown-complex.png');
  });

  test('should match dropdown hover state', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/components/dropdown`);

    await page.click('[data-testid="dropdown-trigger"]');
    await page.waitForTimeout(200);

    // Hover over first item
    const firstItem = page.locator('[data-testid="dropdown-item-0"]');
    await firstItem.hover();
    await page.waitForTimeout(100);
    await expect(page).toHaveScreenshot('dropdown-item-hover.png');
  });
});

test.describe('Select Component Visual Tests', () => {
  test('should match select closed state', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/components/select`);

    const select = page.locator('[data-testid="select-basic"]');
    await expect(select).toHaveScreenshot('select-closed.png');
  });

  test('should match select open state', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/components/select`);

    await page.click('[data-testid="select-basic"]');
    await page.waitForTimeout(200);
    await expect(page).toHaveScreenshot('select-open.png');
  });

  test('should match select with selected value', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/components/select`);

    await page.click('[data-testid="select-basic"]');
    await page.click('[data-testid="select-option-1"]');
    await page.waitForTimeout(200);

    const select = page.locator('[data-testid="select-basic"]');
    await expect(select).toHaveScreenshot('select-selected.png');
  });

  test('should match multi-select', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/components/select`);

    const multiSelect = page.locator('[data-testid="select-multiple"]');

    // Select multiple options
    await page.click('[data-testid="select-multiple"]');
    await page.click('[data-testid="select-option-0"]');
    await page.click('[data-testid="select-option-2"]');
    await page.click('[data-testid="select-option-4"]');
    await page.waitForTimeout(200);

    await expect(multiSelect).toHaveScreenshot('select-multiple-selected.png');
  });
});

test.describe('Design System Colors Visual Tests', () => {
  test('should match color palette', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/design-system/colors`);

    const colorPalette = page.locator('[data-testid="color-palette"]');
    await expect(colorPalette).toHaveScreenshot('design-system-colors.png', {
      maxDiffPixels: 500,
    });
  });

  test('should match primary color scale', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/design-system/colors`);

    const primaryScale = page.locator('[data-testid="color-scale-primary"]');
    await expect(primaryScale).toHaveScreenshot('color-scale-primary.png', {
      maxDiffPixels: 200,
    });
  });
});

test.describe('Design System Typography Visual Tests', () => {
  test('should match typography scale', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/design-system/typography`);

    const typographyScale = page.locator('[data-testid="typography-scale"]');
    await expect(typographyScale).toHaveScreenshot('typography-scale.png', {
      maxDiffPixels: 200,
    });
  });

  test('should match font weights', async ({ page }) => {
    await page.goto(`${COMPONENTS_URL}/design-system/typography`);

    const fontWeights = page.locator('[data-testid="font-weights"]');
    await expect(fontWeights).toHaveScreenshot('font-weights.png', {
      maxDiffPixels: 100,
    });
  });
});

test.describe('Responsive Design Visual Tests', () => {
  test('should match mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${COMPONENTS_URL}/dashboard`);
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('dashboard-mobile.png', {
      fullPage: true,
      maxDiffPixels: 1000,
    });
  });

  test('should match tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${COMPONENTS_URL}/dashboard`);
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('dashboard-tablet.png', {
      fullPage: true,
      maxDiffPixels: 1000,
    });
  });

  test('should match desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`${COMPONENTS_URL}/dashboard`);
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('dashboard-desktop.png', {
      fullPage: true,
      maxDiffPixels: 1000,
    });
  });
});

test.describe('Dark Mode Visual Tests (Future)', () => {
  test.skip('should match components in dark mode', async ({ page }) => {
    // TODO: Implement after dark mode support is added
    await page.goto(`${COMPONENTS_URL}/components/button`);
    await page.emulateMedia({ colorScheme: 'dark' });

    const buttonContainer = page.locator('[data-testid="button-variants"]');
    await expect(buttonContainer).toHaveScreenshot('button-variants-dark.png', {
      maxDiffPixels: 100,
    });
  });
});
