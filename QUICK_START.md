# Quick Start Guide

## 🚀 Installation

```bash
# Install dependencies
npm install

# Install browsers
npm run install:browsers
```

## 🧪 Essential Commands

```bash
# Run all tests (headless)
npm test

# Run tests with UI mode (interactive, best for development)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests and open HTML report
npm run test:report

# Debug tests step-by-step
npm run test:debug
```

## 🌐 Run Tests in Specific Browsers

```bash
# Chrome/Chromium
npm run test:chrome

# Firefox
npm run test:firefox

# Safari/WebKit
npm run test:webkit

# All browsers at once
npm run test:all-browsers
```

## 📊 View HTML Report

After running tests:
```bash
npm run show:report
```

Or manually open:
```bash
# macOS
open playwright-report/index.html

# Linux
xdg-open playwright-report/index.html

# Windows
start playwright-report/index.html
```

## 📁 Project Files

| File | Purpose |
|------|---------|
| `tests/TPMAI/login.spec.js` | Login test |
| `tests/pageObjects/LoginPage.js` | Login page object |
| `playwright.env.js` | Environment variables (credentials) |
| `playwright-report/index.html` | Test report |
| `playwright.config.js` | Main configuration file |

## 🔐 Environment Setup

Edit `playwright.env.js` with your credentials:
```javascript
module.exports = {
  baseUrl: 'https://your-url.com',
  username: 'your-email@example.com',
  password: 'your-password'
};
```

## 📝 Writing Tests

```javascript
const { test, expect } = require('@playwright/test');
const LoginPage = require('../pageObjects/LoginPage');

test.describe('My Test Suite', () => {
  test('should test something', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.visit();
    await loginPage.loginIntoTpmAI();
    await loginPage.verifyLoginSuccess();
  });
});
```

## 🎯 Pro Tips

1. **Use UI Mode** (`npm run test:ui`) - best for development and debugging
2. **Trace Viewer** - automatically available in reports for failed tests
3. **Code Generation** - run `npm run codegen` to record actions and generate test code
4. **Parallel Execution** - tests run in parallel by default for speed

## 📚 Documentation

- 📖 [README.md](./README.md) - Complete project documentation
- 📊 [REPORTING.md](./REPORTING.md) - HTML reporting guide
- 🔐 [ENV_SETUP.md](./ENV_SETUP.md) - Environment configuration
- 🆚 [PLAYWRIGHT_VS_CYPRESS.md](./PLAYWRIGHT_VS_CYPRESS.md) - Key differences

## 🔍 Common Tasks

### Run a specific test file
```bash
npx playwright test tests/TPMAI/login.spec.js
```

### Run tests matching a pattern
```bash
npx playwright test login
```

### Run in debug mode
```bash
npx playwright test --debug
```

### Generate test code by recording
```bash
npx playwright codegen https://your-app-url.com
```

---

**Need Help?** Check the documentation files above or run `npm run test:ui` to use the interactive test runner.

