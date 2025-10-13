const { test, expect } = require('@playwright/test');
const LoginPage = require('../pageObjects/LoginPage');

test.describe('Login to TPMAI', () => {
  test('should login to TPMAI with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.visit();
    await loginPage.loginIntoTpmAI();
    await loginPage.verifyLoginSuccess();
    
    // Click on "Add Third Party" in left panel
    await loginPage.clickAddThirdParty();
    
    // PAUSE: Uncomment the line below to pause after clicking Add Third Party
    // await page.pause();
    
    // Click on "Smart Search" button
    await loginPage.clickSmartSearch();
    
    // PAUSE: Uncomment the line below to pause at the end
    // await page.pause();
  });
});

