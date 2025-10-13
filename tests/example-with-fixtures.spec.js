const { test, expect } = require('@playwright/test');

test.describe('Example Using Fixtures', () => {
  let testData;

  test.beforeAll(() => {
    // Load fixture data
    testData = require('./fixtures/example.json');
  });

  test('should use fixture data', async ({ page }) => {
    console.log('Test data name:', testData.name);
    console.log('Test data email:', testData.email);
    
    // Use the fixture data in the test
    await page.goto('https://example.cypress.io/commands/actions');
    
    const emailInput = page.locator('.action-email');
    await emailInput.fill(testData.email);
    await expect(emailInput).toHaveValue(testData.email);
  });

  test('should access multiple fixture properties', async ({ page }) => {
    expect(testData.name).toBe('Example Fixture');
    expect(testData.email).toBe('test@example.com');
    expect(testData.body).toContain('example test data');
  });
});

test.describe('Dynamic Test Data', () => {
  test('should generate random test data', async ({ page }) => {
    const randomEmail = `user${Date.now()}@example.com`;
    const randomName = `User ${Math.floor(Math.random() * 1000)}`;
    
    console.log('Generated email:', randomEmail);
    console.log('Generated name:', randomName);
    
    // Use in test
    await page.goto('https://example.cypress.io/commands/actions');
    await page.locator('.action-email').fill(randomEmail);
  });
});

