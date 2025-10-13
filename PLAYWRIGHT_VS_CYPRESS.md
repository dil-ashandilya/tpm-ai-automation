# Playwright vs Cypress - Key Differences

A guide to help you understand the main differences between Playwright and Cypress when migrating tests.

## 🔄 Quick Migration Reference

### Test Structure

#### Cypress
```javascript
describe('Test Suite', () => {
  it('test case', () => {
    cy.visit('/');
    cy.get('#button').click();
    cy.get('h1').should('contain', 'Text');
  });
});
```

#### Playwright
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Test Suite', () => {
  test('test case', async ({ page }) => {
    await page.goto('/');
    await page.click('#button');
    await expect(page.locator('h1')).toContainText('Text');
  });
});
```

## 🎯 Key Differences

### 1. Async/Await

**Cypress**: Commands are automatically enqueued and chained
```javascript
cy.visit('/')
  .get('#email')
  .type('user@example.com')
  .get('#submit')
  .click();
```

**Playwright**: Uses standard JavaScript async/await
```javascript
await page.goto('/');
await page.fill('#email', 'user@example.com');
await page.click('#submit');
```

### 2. Page Object

**Cypress**: No built-in page object
```javascript
cy.visit('/');
```

**Playwright**: Page object is passed to each test
```javascript
test('my test', async ({ page }) => {
  await page.goto('/');
});
```

### 3. Element Selection

**Cypress**: Uses jQuery-like selectors
```javascript
cy.get('#email')
cy.get('button[type="submit"]')
cy.contains('Login')
```

**Playwright**: Uses locators (more powerful and reliable)
```javascript
page.locator('#email')
page.locator('button[type="submit"]')
page.getByText('Login')
page.getByRole('button', { name: 'Login' })
```

### 4. Assertions

**Cypress**: Chainable assertions
```javascript
cy.get('h1').should('be.visible')
cy.get('h1').should('contain', 'Welcome')
cy.url().should('include', '/dashboard')
```

**Playwright**: Expect API with auto-waiting
```javascript
await expect(page.locator('h1')).toBeVisible()
await expect(page.locator('h1')).toContainText('Welcome')
await expect(page).toHaveURL(/.*dashboard/)
```

### 5. Waiting

**Cypress**: Automatic retry and wait
```javascript
cy.get('#button').click() // Waits automatically
```

**Playwright**: Auto-waits for actionability
```javascript
await page.click('#button') // Also waits automatically
// Explicit wait if needed
await page.locator('#button').waitFor()
```

### 6. Multiple Browsers

**Cypress**: Limited browser support (Chrome, Firefox, Edge)
```javascript
// Run in specific browser
cypress run --browser chrome
```

**Playwright**: Native support for Chromium, Firefox, WebKit
```javascript
// Configured in playwright.config.js
projects: [
  { name: 'chromium' },
  { name: 'firefox' },
  { name: 'webkit' }
]
```

## 📝 Common Patterns Migration

### Visiting URLs

```javascript
// Cypress
cy.visit('https://example.com/page')
cy.visit('/page') // Uses baseUrl

// Playwright
await page.goto('https://example.com/page')
await page.goto('/page') // Uses baseURL from config
```

### Typing Text

```javascript
// Cypress
cy.get('#email').type('user@example.com')
cy.get('#email').clear().type('new@example.com')

// Playwright
await page.fill('#email', 'user@example.com')
await page.locator('#email').clear()
await page.locator('#email').fill('new@example.com')
// Or just fill (clears automatically)
await page.fill('#email', 'new@example.com')
```

### Clicking Elements

```javascript
// Cypress
cy.get('#button').click()
cy.get('#button').dblclick()
cy.get('#button').rightclick()

// Playwright
await page.click('#button')
await page.dblclick('#button')
await page.click('#button', { button: 'right' })
```

### Checking/Unchecking

```javascript
// Cypress
cy.get('#checkbox').check()
cy.get('#checkbox').uncheck()

// Playwright
await page.check('#checkbox')
await page.uncheck('#checkbox')
```

### Selecting Dropdown Options

```javascript
// Cypress
cy.get('select').select('Option Text')
cy.get('select').select('value')

// Playwright
await page.selectOption('select', 'Option Text')
await page.selectOption('select', { value: 'value' })
```

### Getting Text

```javascript
// Cypress
cy.get('h1').invoke('text').then(text => {
  cy.log(text)
})

// Playwright
const text = await page.locator('h1').textContent()
console.log(text)
```

### Assertions

```javascript
// Cypress
cy.get('#element').should('be.visible')
cy.get('#element').should('have.text', 'Hello')
cy.get('#element').should('have.value', '123')
cy.get('#element').should('have.class', 'active')

// Playwright
await expect(page.locator('#element')).toBeVisible()
await expect(page.locator('#element')).toHaveText('Hello')
await expect(page.locator('#element')).toHaveValue('123')
await expect(page.locator('#element')).toHaveClass(/active/)
```

### Custom Commands vs Fixtures

**Cypress**: Custom commands in `support/commands.js`
```javascript
Cypress.Commands.add('login', (email, password) => {
  cy.get('#email').type(email)
  cy.get('#password').type(password)
  cy.get('button[type="submit"]').click()
})

// Usage
cy.login('user@example.com', 'password')
```

**Playwright**: Use fixtures or helper functions
```javascript
// fixtures/auth.js
exports.login = async (page, email, password) => {
  await page.fill('#email', email)
  await page.fill('#password', password)
  await page.click('button[type="submit"]')
}

// Usage
const { login } = require('./fixtures/auth')
await login(page, 'user@example.com', 'password')
```

### Before/After Hooks

```javascript
// Cypress
beforeEach(() => {
  cy.visit('/login')
})

// Playwright
test.beforeEach(async ({ page }) => {
  await page.goto('/login')
})
```

## 🎨 Advanced Features

### Network Interception

**Cypress**:
```javascript
cy.intercept('GET', '/api/users', { fixture: 'users.json' })
```

**Playwright**:
```javascript
await page.route('**/api/users', route => {
  route.fulfill({ 
    status: 200,
    body: JSON.stringify({ users: [] })
  })
})
```

### File Upload

**Cypress**:
```javascript
cy.get('input[type="file"]').selectFile('path/to/file')
```

**Playwright**:
```javascript
await page.setInputFiles('input[type="file"]', 'path/to/file')
```

### Screenshots

**Cypress**:
```javascript
cy.screenshot('my-screenshot')
```

**Playwright**:
```javascript
await page.screenshot({ path: 'my-screenshot.png' })
```

### Viewport

**Cypress**:
```javascript
cy.viewport(1280, 720)
```

**Playwright**:
```javascript
await page.setViewportSize({ width: 1280, height: 720 })
```

## ⚡ Performance Comparison

| Feature | Cypress | Playwright |
|---------|---------|------------|
| **Parallel Execution** | Requires Cypress Dashboard (paid) | Built-in, free |
| **Multiple Browsers** | One at a time | All in parallel |
| **Speed** | Good | Generally faster |
| **Auto-waiting** | Yes | Yes |

## 🎯 When to Use Each

### Choose Cypress When:
- You want a simpler, more opinionated framework
- You prefer the time-travel debugging in the GUI
- Your team is already familiar with Cypress
- You only need Chrome/Firefox testing

### Choose Playwright When:
- You need true cross-browser testing (including Safari)
- You want better parallel execution
- You prefer standard JavaScript async/await
- You need advanced network control
- You want free parallel execution in CI/CD

## 🔧 Migration Checklist

- [ ] Install Playwright: `npm install @playwright/test`
- [ ] Install browsers: `npx playwright install`
- [ ] Convert `describe` to `test.describe`
- [ ] Convert `it` to `test`
- [ ] Add `async ({ page })` to test functions
- [ ] Add `await` to all page interactions
- [ ] Convert `cy.get()` to `page.locator()`
- [ ] Convert assertions from `.should()` to `expect()`
- [ ] Update custom commands to helper functions
- [ ] Convert page objects to use Playwright locators
- [ ] Update configuration files
- [ ] Update CI/CD pipelines

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Cypress to Playwright Migration Guide](https://playwright.dev/docs/protractor)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)

---

**Tip**: Don't try to convert everything at once. Start with a few simple tests to get comfortable with Playwright's patterns, then gradually migrate the rest.

