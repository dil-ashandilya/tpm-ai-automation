const config = require('../../playwright.env');

class ThirdPartyManagementPage {
  constructor(page) {
    this.page = page;
    // Locators for Third Party Management page
    this.menuButton = page.locator('atlas-global-nav >> button[aria-label="Side navigation"]');
    this.thirdPartyManagementLink = page.locator('a[aria-label="Third Party Management"]');
    this.thirdPartyListContainer = page.locator('[data-testid="third-party-list"], .third-party-list, [class*="third-party"], [class*="ThirdParty"]');
    this.thirdPartyCards = page.locator('[data-testid="third-party-card"], .third-party-card, [class*="third-party-card"], [class*="ThirdPartyCard"]');
    this.thirdPartyRows = page.locator('tr[data-testid*="third-party"], tr[class*="third-party"], tbody tr');
    this.pageTitle = page.locator('h1, h2, [data-testid="page-title"]').filter({ hasText: /third party|Third Party/i });
    this.loadingIndicator = page.locator('[data-testid="loading"], .loading, [class*="loading"], [class*="spinner"]');
    this.emptyStateMessage = page.locator('[data-testid="empty-state"], .empty-state, [class*="empty"], [class*="no-data"]');
  }

  async navigateToThirdPartyManagement() {
    await this.page.waitForTimeout(3000);
    
    // Click hamburger menu to expand navigation
    const menuClicked = await this.page.evaluate(() => {
      const selectors = [
        'button[aria-label="Side navigation"]',
        'button[aria-label="Menu"]',
        'button[aria-label="Open menu"]',
        '.menu-button',
        '.hamburger'
      ];
      
      // Try main document first
      for (const selector of selectors) {
        const button = document.querySelector(selector);
        if (button) {
          button.click();
          return true;
        }
      }
      
      // Try shadow DOM (Atlas navigation)
      const atlasNav = document.querySelector('atlas-global-nav');
      if (atlasNav?.shadowRoot) {
        for (const selector of selectors) {
          const menuButton = atlasNav.shadowRoot.querySelector(selector);
          if (menuButton) {
            menuButton.click();
            return true;
          }
        }
      }
      
      return false;
    });
    
    if (!menuClicked) {
      throw new Error('Could not find hamburger menu button');
    }
    
    await this.page.waitForTimeout(2000);
    
    // Try to click Third Party Management link
    let linkClicked = false;
    
    try {
      await this.thirdPartyManagementLink.waitFor({ state: 'visible', timeout: 5000 });
      await this.thirdPartyManagementLink.click();
      linkClicked = true;
    } catch (error) {
      // Fallback to JavaScript evaluation
      linkClicked = await this.page.evaluate(() => {
        const selectors = [
          'a[aria-label="Third Party Management"]',
          'a[href*="third-party"]',
          'a[href*="thirdparties"]'
        ];
        
        for (const selector of selectors) {
          const links = document.querySelectorAll(selector);
          if (links.length > 0) {
            links[0].click();
            return true;
          }
        }
        
        // Try by text content
        const allLinks = document.querySelectorAll('a');
        for (const link of allLinks) {
          if (link.textContent?.toLowerCase().includes('third party')) {
            link.click();
            return true;
          }
        }
        
        return false;
      });
    }
    
    if (!linkClicked) {
      throw new Error('Could not find or click Third Party Management link');
    }
    
    // Wait for navigation to complete
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    } catch (error) {
      // Continue anyway if timeout
    }
    await this.page.waitForTimeout(2000);
  }

  async checkThirdPartiesAreDisplayed() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
    
    const isEmptyStateVisible = await this.emptyStateMessage.isVisible().catch(() => false);
    if (isEmptyStateVisible) {
      return false;
    }
    
    const thirdPartyElements = await Promise.all([
      this.thirdPartyCards.count(),
      this.thirdPartyRows.count(),
      this.page.locator('[data-testid*="third-party"]').count(),
      this.page.locator('[class*="third-party"]').count(),
      this.page.locator('tbody tr').count()
    ]);
    
    const totalThirdPartyElements = thirdPartyElements.reduce((sum, count) => sum + count, 0);
    
    if (totalThirdPartyElements > 0) {
      return true;
    }
    
    const tableRows = await this.page.locator('table tbody tr').count();
    const listItems = await this.page.locator('ul li, ol li').count();
    
    return tableRows > 0 || listItems > 0;
  }

  async getThirdPartyCount() {
    await this.page.waitForLoadState('networkidle');
    
    const counts = await Promise.all([
      this.thirdPartyCards.count(),
      this.thirdPartyRows.count(),
      this.page.locator('tbody tr').count(),
      this.page.locator('[data-testid*="third-party"]').count()
    ]);
    
    return Math.max(...counts);
  }
}

module.exports = ThirdPartyManagementPage;
