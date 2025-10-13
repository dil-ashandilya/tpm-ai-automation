const config = require('../../playwright.env');

class LoginPage {
  constructor(page) {
    this.page = page;
    // Locators
    this.emailInput = page.locator('#email-input');
    this.passwordInput = page.locator('#password-input');
    this.submitButton = page.locator('button[type="submit"]');
    this.dashboardHeading = page.getByText('Third Party Overview');
    this.menuButton = page.locator('atlas-global-nav >> button[aria-label="Side navigation"]');
    this.thirdPartyManagementLink = page.locator('a[aria-label="Third Party Management"]');
    this.addThirdPartyLink = page.locator('a.MuiButton-root[href="/third-parties/new"]');
    this.smartSearchButton = page.locator('button[role="tab"]:has-text("Smart Search")');
  }

  async visit() {
    await this.page.goto(config.baseUrl + '/dashboard');
  }

  async loginIntoTpmAI(username = config.username, password = config.password) {
    await this.emailInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    
    // Wait for page to load after login
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 30000 });
    } catch (error) {
      console.log('Network idle timeout - continuing');
    }
    
    // Wait for dashboard to be visible (this is the main indicator login worked)
    try {
      await this.dashboardHeading.waitFor({ state: 'visible', timeout: 20000 });
      console.log('✅ Login successful - dashboard loaded');
    } catch (error) {
      console.log('⚠️ Dashboard heading not visible, but continuing');
    }
    
    // Short wait for any remaining data to load
    await this.page.waitForTimeout(3000);
  }

  async verifyLoginSuccess() {
    await this.page.waitForURL('**/dashboard', { timeout: 50000 });
    await this.dashboardHeading.waitFor({ state: 'visible', timeout: 15000 });
  }

  async expandNavigationMenu() {
    try {
      // Try using Playwright locator first
      await this.menuButton.waitFor({ state: 'visible', timeout: 5000 });
      await this.menuButton.click();
    } catch (error) {
      console.log('Menu button not found with locator, trying JavaScript approach...');
      // Fallback to JavaScript evaluation
      await this.page.evaluate(() => {
        const atlasNav = document.querySelector('atlas-global-nav');
        if (atlasNav && atlasNav.shadowRoot) {
          const menuButton = atlasNav.shadowRoot.querySelector('button[aria-label="Side navigation"]');
          if (menuButton) {
            menuButton.click();
            return true;
          }
        }
        return false;
      });
    }
    
  }

  async clickAddThirdParty() {
    await this.page.pause();
    
    // Step 1: Click the menu button to expand navigation
    const menuClicked = await this.page.evaluate(() => {
      const atlasNav = document.querySelector('atlas-global-nav');
      if (atlasNav && atlasNav.shadowRoot) {
        const menuButton = atlasNav.shadowRoot.querySelector('button[aria-label="Side navigation"]');
        if (menuButton) {
          menuButton.click();
          console.log('Menu button clicked');
          return true;
        }
      }
      console.log('Menu button not found');
      return false;
    });
    
    // Step 2: Wait for navigation to expand
    if (menuClicked) {
      await this.page.waitForTimeout(6000);
    }
    
    // Step 3: Click the "Add Third Party" button
    const addButtonClicked = await this.page.evaluate(() => {
      const addButton = document.querySelector('a.MuiButton-root[href="/third-parties/new"]');
      if (addButton) {
        addButton.click();
        console.log('Add Third Party button clicked');
        return true;
      }
      console.log('Add Third Party button not found');
      return false;
    });
    
    // Step 4: Wait for navigation
    if (addButtonClicked) {
      await this.page.waitForTimeout(2000);
    }
  }

  async clickSmartSearch() {
    await this.smartSearchButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.smartSearchButton.click();
  }
}

module.exports = LoginPage;

