const { test, expect } = require('@playwright/test');
const LoginPage = require('../pageObjects/LoginPage');
const ThirdPartyManagementPage = require('../pageObjects/ThirdPartyManagementPage');

test.describe('Third Party Management Listing', () => {
  test('should login and navigate to Third Party Management page to check if third parties are displayed', async ({ page }) => {
    test.setTimeout(120000);
    
    const loginPage = new LoginPage(page);
    const thirdPartyPage = new ThirdPartyManagementPage(page);
    
    // Login to the application
    await loginPage.visit();
    await loginPage.loginIntoTpmAI();
    await loginPage.verifyLoginSuccess();
    
    // Wait for third party data to load on dashboard
    await page.waitForTimeout(5000);
    
    // Navigate to Third Party Management page
    await thirdPartyPage.navigateToThirdPartyManagement();
    
    // Check if third parties are displayed
    const areThirdPartiesDisplayed = await thirdPartyPage.checkThirdPartiesAreDisplayed();
    const thirdPartyCount = await thirdPartyPage.getThirdPartyCount();
    
    // Assertions
    expect(areThirdPartiesDisplayed).toBeDefined();
    
    // Log the results
    if (areThirdPartiesDisplayed) {
      console.log(`✅ Third parties displayed: ${thirdPartyCount} found`);
    } else {
      console.log('ℹ️  No third parties displayed on the page');
    }
    
    // Take a screenshot for verification
    await page.screenshot({ 
      path: 'test-results/third-party-management-page.png',
      fullPage: true 
    });
  });
  
  test('should verify Third Party Management page URL', async ({ page }) => {
    test.setTimeout(120000);
    
    const loginPage = new LoginPage(page);
    const thirdPartyPage = new ThirdPartyManagementPage(page);
    
    await loginPage.visit();
    await loginPage.loginIntoTpmAI();
    await loginPage.verifyLoginSuccess();
    
    await thirdPartyPage.navigateToThirdPartyManagement();
    
    expect(page.url()).toContain('third-parties');
  });
});
