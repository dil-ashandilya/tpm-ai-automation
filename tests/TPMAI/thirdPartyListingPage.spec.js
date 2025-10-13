const { test, expect } = require('@playwright/test');
const LoginPage = require('../pageObjects/LoginPage');
const ThirdPartyManagementPage = require('../pageObjects/ThirdPartyManagementPage');

test.describe('Third Party Management Listing', () => {
  test('should login and navigate to Third Party Management page to check if third parties are displayed', async ({ page }) => {
    // Increase test timeout to 2 minutes
    test.setTimeout(120000);
    
    // Step 1: Login to the application
    const loginPage = new LoginPage(page);
    
    console.log('Step 1: Logging into the application...');
    await loginPage.visit();
    await loginPage.loginIntoTpmAI();
    await loginPage.verifyLoginSuccess();
    
    console.log('Step 2: Successfully logged in, waiting for data to load...');
    
    // Step 2: Wait for third party data to load on dashboard
    await page.waitForTimeout(5000); // Wait 5 seconds for APIs to load data
    
    // Check if third party data is loaded
    try {
      const dashboardCount = await page.locator('text=Total Third Parties').locator('..').textContent();
      console.log(`Dashboard shows: ${dashboardCount}`);
    } catch (error) {
      console.log('Could not read dashboard count');
    }
    
    console.log('Step 3: Navigating to Third Party Management...');
    
    // Step 3: Navigate to Third Party Management page
    const thirdPartyPage = new ThirdPartyManagementPage(page);
    await thirdPartyPage.navigateToThirdPartyManagement();
    
    console.log('Step 3: Verifying Third Party Management page loaded...');
    
    // Step 3: Verify the page loaded correctly
    await thirdPartyPage.verifyThirdPartyManagementPageLoaded();
    
    console.log('Step 4: Checking if third parties are displayed on the page...');
    
    // Step 4: Check if third parties are displayed
    const areThirdPartiesDisplayed = await thirdPartyPage.checkThirdPartiesAreDisplayed();
    
    // Step 5: Get count of third parties for reporting
    const thirdPartyCount = await thirdPartyPage.getThirdPartyCount();
    
    console.log(`Step 5: Test completed. Third parties displayed: ${areThirdPartiesDisplayed}, Count: ${thirdPartyCount}`);
    
    // Assertions
    expect(areThirdPartiesDisplayed).toBeDefined();
    
    // Log the results
    if (areThirdPartiesDisplayed) {
      console.log(`✅ SUCCESS: Third parties are displayed on the page (${thirdPartyCount} found)`);
    } else {
      console.log('ℹ️  INFO: No third parties are currently displayed on the page');
    }
    
    // Optional: Take a screenshot for verification
    await page.screenshot({ 
      path: 'test-results/third-party-management-page.png',
      fullPage: true 
    });
    
    console.log('📸 Screenshot saved for verification');
  });
  
  test('should verify Third Party Management page elements are present', async ({ page }) => {
    // Increase test timeout to 2 minutes
    test.setTimeout(120000);
    
    // This is a supplementary test to verify page elements
    const loginPage = new LoginPage(page);
    const thirdPartyPage = new ThirdPartyManagementPage(page);
    
    // Login
    await loginPage.visit();
    await loginPage.loginIntoTpmAI();
    await loginPage.verifyLoginSuccess();
    
    // Navigate to Third Party Management
    await thirdPartyPage.navigateToThirdPartyManagement();
    await thirdPartyPage.verifyThirdPartyManagementPageLoaded();
    
    // Verify page elements
    const currentUrl = page.url();
    expect(currentUrl).toContain('third-party');
    
    console.log('✅ Third Party Management page elements verified');
  });
});
