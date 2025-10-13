const { test, expect } = require('@playwright/test');

test.describe('Basic Actions Examples', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/commands/actions');
  });

  test('should type in an input field', async ({ page }) => {
    const emailInput = page.locator('.action-email');
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
  });

  test('should click a button', async ({ page }) => {
    const button = page.locator('.action-btn');
    await button.click();
    await expect(button).toBeVisible();
  });

  test('should check and uncheck checkbox', async ({ page }) => {
    const checkbox = page.locator('.action-checkboxes [type="checkbox"]').first();
    
    // Check the checkbox
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    
    // Uncheck the checkbox
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('should select a radio button', async ({ page }) => {
    const radio = page.locator('.action-radios [type="radio"]').first();
    await radio.check();
    await expect(radio).toBeChecked();
  });

  test('should select from dropdown', async ({ page }) => {
    const select = page.locator('.action-select');
    await select.selectOption('apples');
    await expect(select).toHaveValue('apples');
  });

  test('should handle double click', async ({ page }) => {
    const button = page.locator('.action-div');
    await button.dblclick();
    await expect(button).toBeVisible();
  });

  test('should scroll to element', async ({ page }) => {
    const button = page.locator('#action-canvas');
    await button.scrollIntoViewIfNeeded();
    await expect(button).toBeVisible();
  });
});

test.describe('Assertions Examples', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io');
  });

  test('should verify text content', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Kitchen Sink');
    await expect(page.locator('h1')).toHaveText(/Kitchen/);
  });

  test('should verify element visibility', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.nonexistent')).not.toBeVisible();
  });

  test('should verify URL', async ({ page }) => {
    await expect(page).toHaveURL('https://example.cypress.io');
  });

  test('should verify element count', async ({ page }) => {
    const links = page.locator('a');
    await expect(links).toHaveCount(await links.count());
  });

  test('should verify element attribute', async ({ page }) => {
    const logo = page.locator('.navbar-brand');
    await expect(logo).toHaveAttribute('href', '/');
  });
});

