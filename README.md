# Playwright Testing Project

This is a Playwright end-to-end testing project set up and ready to use.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Install Playwright browsers:

```bash
npm run install:browsers
```

Or install specific browsers:
```bash
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

## Running Tests

### Run Tests in Headless Mode
Run all tests in the terminal without opening a browser window:

```bash
npm test
```

### Run Tests in Headed Mode
See the browser while tests are running:

```bash
npm run test:headed
```

### Run Tests with UI Mode (Interactive)
Open the Playwright UI where you can see tests running with time-travel debugging:

```bash
npm run test:ui
```

### Run Tests in Specific Browsers

```bash
# Chromium only
npm run test:chrome

# Firefox only
npm run test:firefox

# WebKit (Safari) only
npm run test:webkit

# All browsers
npm run test:all-browsers
```

### Debug Mode
Run tests with Playwright Inspector for step-by-step debugging:

```bash
npm run test:debug
```

### Run Tests and View HTML Report

```bash
npm run test:report
```

After running, the report will automatically open in your browser. You can also manually open it:

```bash
npm run show:report
```

📊 **See [REPORTING.md](./REPORTING.md) for detailed reporting documentation**

## Project Structure

```
UI_Playwright/
├── tests/
│   ├── TPMAI/                      # TPMAI test files
│   │   ├── login.spec.js           # Login test
│   │   └── sample-with-report.spec.js  # Sample tests for report demo
│   ├── pageObjects/                # Page Object Model files
│   │   └── LoginPage.js            # Login page object
│   └── fixtures/                   # Test data files
│       └── example.json            # Sample fixture data
├── playwright-report/              # HTML reports (generated)
├── test-results/                   # Test artifacts (screenshots, videos)
├── playwright.config.js            # Playwright configuration
├── playwright.env.js               # Environment variables (credentials)
├── package.json                    # Project dependencies
└── README.md                       # This file
```

## Writing Tests

Create new test files in the `tests/` directory with the `.spec.js` extension.

### Example Test

```javascript
const { test, expect } = require('@playwright/test');

test.describe('My Test Suite', () => {
  test('should do something', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page.locator('h1')).toContainText('Example Domain');
  });
});
```

### Using Page Objects

```javascript
const { test, expect } = require('@playwright/test');
const LoginPage = require('../pageObjects/LoginPage');

test('should login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.visit();
  await loginPage.loginIntoTpmAI();
  await loginPage.verifyLoginSuccess();
});
```

## Configuration

Edit `playwright.config.js` to customize:
- **baseURL**: Default URL for navigation
- **viewport**: Browser viewport size
- **video**: Video recording settings
- **screenshot**: Screenshot capture settings
- **trace**: Trace recording for debugging
- **timeout**: Various timeout settings

## Environment Variables

Edit `playwright.env.js` with your credentials:

```javascript
module.exports = {
  baseUrl: 'http://localhost:3000/',
  username: 'your-email@example.com',
  password: 'your-password'
};
```

## Fixtures

Store test data in `tests/fixtures/` as JSON files. Load them in tests:

```javascript
const testData = require('./fixtures/example.json');

test('use fixture data', async ({ page }) => {
  console.log(testData.name);
});
```

## Code Generation

Playwright can generate tests by recording your actions:

```bash
npm run codegen
```

This opens a browser where you can interact with a website, and Playwright will generate the test code.

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright Examples](https://github.com/microsoft/playwright/tree/main/examples)

## Tips

1. Use `page.locator()` for selecting elements (more reliable than other selectors)
2. Always use `await` with async operations
3. Use `test.describe()` to group related tests
4. Use `test.beforeEach()` for setup code that runs before each test
5. Keep tests independent - each test should be able to run on its own
6. Use descriptive test names that explain what is being tested
7. Leverage the Playwright UI mode for debugging (`npm run test:ui`)

## Key Differences from Cypress

1. **Auto-waiting**: Playwright automatically waits for elements to be actionable
2. **Multiple browsers**: Native support for Chromium, Firefox, and WebKit
3. **Network interception**: More powerful network mocking capabilities
4. **Parallel execution**: Tests run in parallel by default
5. **No auto-retry**: Commands don't auto-retry (but tests can be configured to retry)
6. **True async/await**: Uses standard JavaScript async/await patterns

## Troubleshooting

If tests fail or browsers don't open:

1. Make sure you have installed browsers: `npm run install:browsers`
2. Check Node.js version: `node --version` (should be v16 or higher)
3. Clear Playwright cache: `npx playwright cache clear`
4. Reinstall Playwright: `npm install @playwright/test --save-dev`
5. Check Playwright version: `npx playwright --version`

## Common Commands

```bash
# Run a specific test file
npx playwright test tests/TPMAI/login.spec.js

# Run tests matching a pattern
npx playwright test login

# Run in headed mode with specific browser
npx playwright test --headed --project=chromium

# Show report
npx playwright show-report

# Generate test code
npx playwright codegen https://example.com
```

Happy Testing! 🚀

