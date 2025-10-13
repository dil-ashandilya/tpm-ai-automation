# Playwright HTML Reporting

Playwright provides powerful built-in HTML reporting with rich features including traces, screenshots, and videos.

## 📊 Generating Reports

### Automatic Report Generation

Reports are automatically generated when running tests:

```bash
npm test
```

### View Report

```bash
npm run show:report
```

Or manually:
```bash
# macOS
open playwright-report/index.html

# Linux
xdg-open playwright-report/index.html

# Windows
start playwright-report/index.html
```

## 📁 Report Location

Reports are generated in the `playwright-report/` directory:
```
playwright-report/
├── index.html          # Main report file
├── data/              # Test data
└── trace/             # Trace files
```

## 🎨 Report Features

### 1. **Test Results Overview**
- ✅ Passed tests
- ❌ Failed tests
- ⏭️ Skipped tests
- ⏱️ Execution time
- Browser coverage

### 2. **Trace Viewer**
For failed tests (or all tests if configured), you get:
- **Timeline**: Visual timeline of all actions
- **Screenshots**: Automatic screenshots at each step
- **Network**: All network requests and responses
- **Console**: Console logs from the browser
- **Source**: Test source code with highlighted execution

### 3. **Attachments**
- Screenshots on failure
- Videos of test execution (on failure by default)
- Full page traces for debugging

## ⚙️ Report Configuration

Edit `playwright.config.js` to customize reporting:

```javascript
reporter: [
  ['html', { 
    outputFolder: 'playwright-report',
    open: 'never'  // 'always', 'never', or 'on-failure'
  }],
  ['list'],  // Console output
  ['json', { 
    outputFile: 'playwright-report/test-results.json' 
  }]
]
```

## 📸 Screenshots and Videos

### Current Configuration
```javascript
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'on-first-retry',
}
```

### Options

**Screenshots:**
- `'off'` - No screenshots
- `'only-on-failure'` - Screenshot on failure (default)
- `'on'` - Screenshot after each action

**Videos:**
- `'off'` - No videos
- `'retain-on-failure'` - Keep videos only for failed tests (default)
- `'on'` - Record all tests
- `'on-first-retry'` - Record on retry

**Traces:**
- `'off'` - No traces
- `'on-first-retry'` - Trace on retry (default)
- `'on'` - Trace all tests
- `'retain-on-failure'` - Keep traces for failed tests

## 🔍 Using Trace Viewer

Traces provide the most detailed debugging information.

### View Trace from Report
1. Run tests: `npm test`
2. Open report: `npm run show:report`
3. Click on a failed test
4. Click "View trace" button

### View Trace Directly
```bash
npx playwright show-trace test-results/path-to-trace.zip
```

### Trace Features
- **Action timeline**: See every action with timing
- **Before/After screenshots**: Visual state before and after each action
- **Network activity**: All requests and responses
- **Console logs**: Browser console output
- **Inspect DOM**: View DOM at any point in time

## 📋 Multiple Reporters

You can use multiple reporters simultaneously:

```javascript
reporter: [
  ['html'],                    // HTML report
  ['list'],                    // Console output
  ['json', { outputFile: 'results.json' }],  // JSON output
  ['junit', { outputFile: 'results.xml' }],  // JUnit XML
]
```

## 🎯 Best Practices

1. **Use Trace on Failures**: Keep `trace: 'on-first-retry'` for debugging without performance overhead
2. **Video on Failure**: Use `video: 'retain-on-failure'` to see what happened
3. **Screenshots**: `screenshot: 'only-on-failure'` provides good debugging info
4. **CI Integration**: Configure `open: 'never'` in reporter options for CI/CD
5. **Retention**: Clean up old reports periodically to save disk space

## 🚀 CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Playwright tests
  run: npm test

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

### View Reports in CI
After tests run, download the `playwright-report` artifact and open `index.html` locally.

## 📊 Custom Reporting

### Add Custom Test Info
```javascript
test('my test', async ({ page }, testInfo) => {
  // Add custom attachment
  await testInfo.attach('screenshot', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});
```

### Add Annotations
```javascript
test('my test', async ({ page }) => {
  test.info().annotations.push({ type: 'issue', description: 'JIRA-123' });
  // Test code...
});
```

## 🔗 Additional Resources

- [Playwright Reporters Documentation](https://playwright.dev/docs/test-reporters)
- [Trace Viewer Guide](https://playwright.dev/docs/trace-viewer)
- [CI Integration Guide](https://playwright.dev/docs/ci)

---

**Tip**: Use `npm run test:ui` for the best interactive debugging experience during development!

