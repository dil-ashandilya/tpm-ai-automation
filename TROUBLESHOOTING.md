# Troubleshooting Guide

Common issues and solutions for Playwright tests.

## 🔧 Installation Issues

### Browsers Not Installing

**Problem**: `npm run install:browsers` fails or browsers don't work

**Solutions**:
```bash
# Try installing with sudo (macOS/Linux)
sudo npx playwright install

# Or install specific browser
npx playwright install chromium

# Install system dependencies (Linux)
npx playwright install-deps

# Check installation
npx playwright --version
```

### Permission Denied Errors

**Problem**: Permission errors during installation

**Solution** (macOS/Linux):
```bash
sudo chown -R $(whoami) ~/.cache/ms-playwright
```

## 🌐 Test Execution Issues

### Tests Timeout

**Problem**: Tests fail with timeout errors

**Solutions**:

1. **Increase timeouts in config**:
```javascript
// playwright.config.js
use: {
  actionTimeout: 30000,        // Increase from 15000
  navigationTimeout: 90000,    // Increase from 60000
}
```

2. **Increase test timeout**:
```javascript
test('my test', async ({ page }) => {
  test.setTimeout(120000); // 2 minutes
  // test code...
});
```

3. **Wait for specific conditions**:
```javascript
await page.waitForLoadState('networkidle');
await page.waitForSelector('#my-element', { timeout: 30000 });
```

### Element Not Found

**Problem**: `Error: locator.click: Target closed` or element not found

**Solutions**:

1. **Wait for element**:
```javascript
await page.locator('#my-button').waitFor({ state: 'visible' });
await page.locator('#my-button').click();
```

2. **Use more specific selectors**:
```javascript
// Instead of
await page.click('button');

// Use
await page.click('button[type="submit"]');
// or
await page.click('button:has-text("Login")');
```

3. **Check if element is in iframe**:
```javascript
const frame = page.frameLocator('iframe#my-frame');
await frame.locator('button').click();
```

### Tests Pass Locally But Fail in CI

**Problem**: Tests work on local machine but fail in CI/CD

**Solutions**:

1. **Use explicit waits**:
```javascript
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1000); // Only as last resort
```

2. **Disable animations** (add to playwright.config.js):
```javascript
use: {
  // Disable CSS animations
  hasTouch: false,
  isMobile: false,
  // Use faster animations in tests
  // Can be configured per test if needed
}
```

3. **Set CI-specific config**:
```javascript
// playwright.config.js
module.exports = defineConfig({
  workers: process.env.CI ? 1 : undefined,
  retries: process.env.CI ? 2 : 0,
});
```

## 🔐 Authentication Issues

### Login Fails

**Problem**: Cannot login or authentication doesn't work

**Solutions**:

1. **Check credentials**:
```javascript
const config = require('./playwright.env');
console.log('Using username:', config.username);
// Make sure password is correct but don't log it!
```

2. **Wait for navigation after login**:
```javascript
await page.click('button[type="submit"]');
await page.waitForURL('**/dashboard', { timeout: 30000 });
```

3. **Handle redirects**:
```javascript
await Promise.all([
  page.waitForNavigation({ waitUntil: 'networkidle' }),
  page.click('button[type="submit"]')
]);
```

### Session Storage Issues

**Problem**: Session/cookies not persisting

**Solution** - Save and reuse authentication state:
```javascript
// auth.setup.js
const { test } = require('@playwright/test');

test('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#email', 'user@example.com');
  await page.fill('#password', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  
  // Save signed-in state
  await page.context().storageState({ path: 'auth.json' });
});
```

Then use it in tests:
```javascript
// playwright.config.js
use: {
  storageState: 'auth.json',
}
```

## 🎥 Video/Screenshot Issues

### Videos Not Recording

**Problem**: No videos in test-results folder

**Solutions**:

1. **Check config**:
```javascript
use: {
  video: 'on', // or 'retain-on-failure'
}
```

2. **Check file system permissions**:
```bash
chmod -R 755 test-results/
```

### Screenshots Too Small

**Problem**: Screenshots don't capture full page

**Solution**:
```javascript
// Take full page screenshot
await page.screenshot({ 
  path: 'screenshot.png', 
  fullPage: true 
});
```

## 🚀 Performance Issues

### Tests Running Slowly

**Problem**: Tests take too long to execute

**Solutions**:

1. **Enable parallel execution**:
```javascript
// playwright.config.js
fullyParallel: true,
workers: 4, // Adjust based on CPU cores
```

2. **Reduce video/screenshot overhead**:
```javascript
use: {
  video: 'retain-on-failure', // Not 'on'
  screenshot: 'only-on-failure', // Not 'on'
  trace: 'on-first-retry', // Not 'on'
}
```

3. **Optimize waits**:
```javascript
// Don't use fixed waits
// await page.waitForTimeout(5000); ❌

// Use conditional waits
await page.waitForSelector('#element'); ✅
await page.waitForLoadState('domcontentloaded'); ✅
```

## 🔍 Debugging Issues

### Can't See What's Happening

**Solutions**:

1. **Run in headed mode**:
```bash
npm run test:headed
```

2. **Use UI mode** (best option):
```bash
npm run test:ui
```

3. **Use debug mode**:
```bash
npm run test:debug
```

4. **Slow down execution**:
```javascript
await page.pause(); // Opens Playwright Inspector
```

### Need to Inspect Element

**Solution** - Use Playwright Inspector:
```javascript
test('debug test', async ({ page }) => {
  await page.goto('/');
  await page.pause(); // Opens inspector
  // You can now inspect elements and step through
});
```

Or use codegen:
```bash
npm run codegen https://your-app-url.com
```

## 🌐 Network Issues

### Network Requests Failing

**Problem**: API calls fail during tests

**Solutions**:

1. **Wait for network idle**:
```javascript
await page.goto('/', { waitUntil: 'networkidle' });
```

2. **Mock network requests**:
```javascript
await page.route('**/api/data', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({ data: 'mocked' })
  });
});
```

3. **Check network logs**:
```javascript
page.on('response', response => {
  console.log('Response:', response.url(), response.status());
});
```

### CORS Errors

**Problem**: CORS errors in browser console

**Solution**:
```javascript
// playwright.config.js
use: {
  bypassCSP: true, // Bypass Content-Security-Policy
}
```

## 📦 Module/Import Issues

### Cannot Find Module

**Problem**: `Cannot find module './pageObjects/LoginPage'`

**Solutions**:

1. **Check file path**:
```javascript
// Correct relative path
const LoginPage = require('../pageObjects/LoginPage');
```

2. **Check file extension**:
```bash
# File should be named LoginPage.js not LoginPage
```

3. **Check case sensitivity** (especially on Linux):
```javascript
// Make sure case matches exactly
require('./LoginPage'); // not './loginpage'
```

## 🔄 Update Issues

### Playwright Version Mismatch

**Problem**: Errors after updating Playwright

**Solutions**:
```bash
# Reinstall browsers after update
npm install @playwright/test@latest
npm run install:browsers

# Clear cache
npx playwright cache clear

# Reinstall everything
rm -rf node_modules package-lock.json
npm install
npm run install:browsers
```

## 📊 Report Issues

### Report Not Generating

**Problem**: No HTML report after test run

**Solutions**:

1. **Check reporter config**:
```javascript
// playwright.config.js
reporter: [['html']],
```

2. **Run with explicit report flag**:
```bash
npx playwright test --reporter=html
```

3. **Check permissions**:
```bash
chmod -R 755 playwright-report/
```

### Can't Open Report

**Problem**: Report HTML won't open in browser

**Solution**:
```bash
# Use Playwright's built-in server
npm run show:report

# Or
npx playwright show-report
```

## 🆘 Getting Help

If you're still stuck:

1. **Enable verbose logging**:
```bash
DEBUG=pw:api npx playwright test
```

2. **Check Playwright logs**:
```bash
npx playwright test --debug
```

3. **Resources**:
   - [Playwright Documentation](https://playwright.dev/)
   - [GitHub Issues](https://github.com/microsoft/playwright/issues)
   - [Discord Community](https://aka.ms/playwright/discord)
   - [Stack Overflow](https://stackoverflow.com/questions/tagged/playwright)

4. **Create minimal reproduction**:
   - Isolate the failing test
   - Remove unnecessary code
   - Share with the team or community

---

**Pro Tip**: Use `npm run test:ui` for the best debugging experience! It provides time-travel debugging and detailed insights into what's happening in your tests.

