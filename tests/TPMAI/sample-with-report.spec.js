const { test, expect } = require('@playwright/test');

test.describe('Sample Test for Report Demo', () => {
  test('✅ should pass - successful test', async ({ page }) => {
    await page.goto('https://example.cypress.io');
    await expect(page.getByText('Kitchen Sink')).toBeVisible();
  });

  test('✅ should pass - another successful test', async ({ page }) => {
    await page.goto('https://example.cypress.io');
    await expect(page.locator('h1')).toContainText('Kitchen Sink');
  });

  test.skip('⏭️ should be skipped - pending test', async ({ page }) => {
    // This test will be marked as pending in the report
    await page.goto('https://example.cypress.io');
  });

  // Uncomment to see failed test in report
  // test('❌ should fail - to demonstrate failure reporting', async ({ page }) => {
  //   await page.goto('https://example.cypress.io');
  //   await expect(page.locator('h1')).toContainText('This Will Fail');
  // });
});

test.describe('Test Suite with Multiple Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/commands/actions');
  });

  test('should type in input field', async ({ page }) => {
    const emailInput = page.locator('.action-email');
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
  });

  test('should click button', async ({ page }) => {
    const actionBtn = page.locator('.action-btn');
    await actionBtn.click();
    await expect(actionBtn).toBeVisible();
  });

  test('should check checkbox', async ({ page }) => {
    const firstCheckbox = page.locator('.action-checkboxes [type="checkbox"]').first();
    await firstCheckbox.check();
    await expect(firstCheckbox).toBeChecked();
  });
});

