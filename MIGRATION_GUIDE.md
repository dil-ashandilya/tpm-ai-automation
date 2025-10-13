# Migration Guide from Cypress to Playwright

This document explains how the Cypress tests were converted to Playwright in this project.

## 📁 Project Structure Comparison

### Cypress Structure
```
UI_Cypress/
├── cypress/
│   ├── e2e/
│   │   └── TPMAI/
│   │       ├── login.cy.js
│   │       └── sample-with-report.cy.js
│   ├── support/
│   │   └── pageObject/
│   │       └── login.js
│   └── fixtures/
├── cypress.config.js
└── cypress.env.json
```

### Playwright Structure
```
UI_Playwright/
├── tests/
│   ├── TPMAI/
│   │   ├── login.spec.js
│   │   └── sample-with-report.spec.js
│   ├── pageObjects/
│   │   └── LoginPage.js
│   └── fixtures/
├── playwright.config.js
└── playwright.env.js
```

## 🔄 Key Changes Made

### 1. Configuration Files

#### Cypress (`cypress.config.js`)
```javascript
module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  e2e: {
    baseUrl: 'http://localhost:3000/',
    viewportWidth: 1280,
    viewportHeight: 720,
  },
})
```

#### Playwright (`playwright.config.js`)
```javascript
module.exports = defineConfig({
  testDir: './tests',
  reporter: [['html'], ['list']],
  use: {
    baseURL: 'http://localhost:3000/',
    viewport: { width: 1280, height: 720 },
  },
})
```

### 2. Environment Variables

#### Cypress (`cypress.env.json`)
```json
{
  "baseUrl": "...",
  "username": "...",
  "password": "..."
}
```

#### Playwright (`playwright.env.js`)
```javascript
module.exports = {
  baseUrl: '...',
  username: '...',
  password: '...'
};
```

### 3. Login Page Object

#### Cypress Version
```javascript
class LoginPage {
  webLocators = {
    getUserName: () => cy.get('#email-input'),
    getPassword: () => cy.get('#password-input'),
    getSubmit: () => cy.get('button[type="submit"]'),
  };

  visit() {
    cy.visit(Cypress.env('baseUrl') + '/dashboard');
  }

  loginIntoTpmAI(username = Cypress.env('username'), password = Cypress.env('password')) {
    this.webLocators.getUserName().type(username);
    this.webLocators.getPassword().type(password);
    this.webLocators.getSubmit().click();
  }

  verifyLoginSuccess() {
    cy.url({ timeout: 30000 }).should('include', '/dashboard');
    cy.contains('Third Party Overview', { timeout: 15000 }).should('be.visible');
  }
}

export default new LoginPage();
```

#### Playwright Version
```javascript
class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('#email-input');
    this.passwordInput = page.locator('#password-input');
    this.submitButton = page.locator('button[type="submit"]');
    this.dashboardHeading = page.getByText('Third Party Overview');
  }

  async visit() {
    await this.page.goto(config.baseUrl + '/dashboard');
  }

  async loginIntoTpmAI(username = config.username, password = config.password) {
    await this.emailInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async verifyLoginSuccess() {
    await this.page.waitForURL('**/dashboard', { timeout: 30000 });
    await this.dashboardHeading.waitFor({ state: 'visible', timeout: 15000 });
  }
}

module.exports = LoginPage;
```

**Key Changes:**
- Constructor accepts `page` parameter
- Locators defined in constructor, not as functions
- All methods are `async`
- Uses `fill()` instead of `type()`
- Uses `waitForURL()` instead of checking URL
- Uses `waitFor()` for element visibility
- Exports class (not instance)

### 4. Login Test

#### Cypress Version
```javascript
import LoginPage from '../../support/pageObject/login';

describe('Login to TPMAI', () => {
  it('should login to TPMAI with valid credentials', () => {
    LoginPage.visit();
    LoginPage.loginIntoTpmAI();
    LoginPage.verifyLoginSuccess();
  });
});
```

#### Playwright Version
```javascript
const { test, expect } = require('@playwright/test');
const LoginPage = require('../pageObjects/LoginPage');

test.describe('Login to TPMAI', () => {
  test('should login to TPMAI with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.visit();
    await loginPage.loginIntoTpmAI();
    await loginPage.verifyLoginSuccess();
  });
});
```

**Key Changes:**
- Import `test` and `expect` from `@playwright/test`
- Use `require()` instead of `import` (or can use ES6 imports)
- `describe` → `test.describe`
- `it` → `test`
- Test function is `async` with `{ page }` parameter
- Create new instance of page object with `page`
- Add `await` to all page object methods

### 5. Sample Report Test

#### Cypress Version
```javascript
describe('Sample Test for Report Demo', () => {
  it('✅ should pass - successful test', () => {
    cy.visit('https://example.cypress.io');
    cy.contains('Kitchen Sink').should('be.visible');
  });

  it('should type in input field', () => {
    cy.get('.action-email')
      .type('test@example.com')
      .should('have.value', 'test@example.com');
  });

  it('should check checkbox', () => {
    cy.get('.action-checkboxes [type="checkbox"]')
      .first()
      .check()
      .should('be.checked');
  });
});
```

#### Playwright Version
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Sample Test for Report Demo', () => {
  test('✅ should pass - successful test', async ({ page }) => {
    await page.goto('https://example.cypress.io');
    await expect(page.getByText('Kitchen Sink')).toBeVisible();
  });

  test('should type in input field', async ({ page }) => {
    const emailInput = page.locator('.action-email');
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
  });

  test('should check checkbox', async ({ page }) => {
    const firstCheckbox = page.locator('.action-checkboxes [type="checkbox"]').first();
    await firstCheckbox.check();
    await expect(firstCheckbox).toBeChecked();
  });
});
```

**Key Changes:**
- `cy.visit()` → `page.goto()`
- `cy.get()` → `page.locator()`
- `cy.contains()` → `page.getByText()`
- `.type()` → `.fill()`
- `.should('be.visible')` → `expect(...).toBeVisible()`
- `.should('have.value', ...)` → `expect(...).toHaveValue(...)`
- `.should('be.checked')` → `expect(...).toBeChecked()`
- Store locators in variables for reuse

## 📊 Command Mapping

| Cypress | Playwright |
|---------|------------|
| `cy.visit(url)` | `await page.goto(url)` |
| `cy.get(selector)` | `page.locator(selector)` |
| `cy.contains(text)` | `page.getByText(text)` |
| `.type(text)` | `.fill(text)` |
| `.click()` | `await .click()` |
| `.check()` | `await .check()` |
| `.uncheck()` | `await .uncheck()` |
| `.select(value)` | `await .selectOption(value)` |
| `.should('be.visible')` | `await expect(...).toBeVisible()` |
| `.should('contain', text)` | `await expect(...).toContainText(text)` |
| `.should('have.value', val)` | `await expect(...).toHaveValue(val)` |
| `.should('be.checked')` | `await expect(...).toBeChecked()` |
| `cy.url().should('include', path)` | `await expect(page).toHaveURL(/path/)` |
| `cy.wait(ms)` | `await page.waitForTimeout(ms)` |

## 🚀 Running Tests

### Cypress Commands
```bash
npm run cy:open          # Open Cypress UI
npm run cy:run           # Run tests headless
npm run cy:run:chrome    # Run in Chrome
npm run cy:run:report    # Run with report
```

### Playwright Commands
```bash
npm run test:ui          # Open Playwright UI (similar to cy:open)
npm test                 # Run tests headless
npm run test:chrome      # Run in Chromium
npm run test:report      # Run with report
npm run test:headed      # Run in headed mode
npm run test:debug       # Debug mode
```

## ✨ Additional Features in Playwright

1. **Multi-Browser Support**
   - Run tests in Chromium, Firefox, and WebKit simultaneously
   - `npm run test:all-browsers`

2. **Built-in Parallel Execution**
   - Tests run in parallel by default
   - No need for paid dashboard

3. **Advanced Debugging**
   - UI Mode with time-travel debugging
   - Trace viewer with full timeline
   - `npm run test:ui`

4. **Better Performance**
   - Faster test execution
   - More efficient resource usage

5. **Code Generation**
   - Record actions and generate test code
   - `npm run codegen`

## 📝 Migration Checklist

When migrating additional tests from Cypress to Playwright:

- [ ] Convert file extension from `.cy.js` to `.spec.js`
- [ ] Add `const { test, expect } = require('@playwright/test')`
- [ ] Change `describe` to `test.describe`
- [ ] Change `it` to `test`
- [ ] Add `async ({ page })` to test functions
- [ ] Add `await` before all page interactions
- [ ] Convert `cy.get()` to `page.locator()`
- [ ] Convert `.should()` assertions to `expect()` statements
- [ ] Update page objects to accept `page` in constructor
- [ ] Convert `.type()` to `.fill()`
- [ ] Update custom commands to helper functions
- [ ] Test in all browsers: `npm run test:all-browsers`

## 🎯 Best Practices Applied

1. **Page Object Pattern**: Maintained consistent structure
2. **Async/Await**: Proper JavaScript async patterns
3. **Locator Reusability**: Store locators as class properties
4. **Clear Assertions**: Use descriptive assertion methods
5. **Auto-Waiting**: Leverage Playwright's built-in waiting
6. **Multiple Browsers**: Test across all major engines

## 📚 Additional Resources

- Full comparison: [PLAYWRIGHT_VS_CYPRESS.md](./PLAYWRIGHT_VS_CYPRESS.md)
- Getting started: [QUICK_START.md](./QUICK_START.md)
- Complete docs: [README.md](./README.md)
- Troubleshooting: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

**Success!** 🎉 The migration is complete. All Cypress tests have been successfully converted to Playwright with equivalent functionality and additional features.

