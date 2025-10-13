# Environment Setup Guide

This guide explains how to configure environment-specific settings for your Playwright tests.

## 📋 Configuration File

The project uses `playwright.env.js` for storing environment variables:

```javascript
module.exports = {
  baseUrl: 'http://localhost:3000/',
  username: 'csimpy@diligent.com',
  password: 'Charu@123'
};
```

## 🔐 Security Best Practices

### For Local Development
The current setup works fine for local testing, but consider these options for better security:

### Option 1: Use .env File (Recommended)
1. Install dotenv:
```bash
npm install dotenv --save-dev
```

2. Create `.env` file (already in `.gitignore`):
```env
BASE_URL=http://localhost:3000/
USERNAME=csimpy@diligent.com
PASSWORD=Charu@123
```

3. Update `playwright.env.js`:
```javascript
require('dotenv').config();

module.exports = {
  baseUrl: process.env.BASE_URL,
  username: process.env.USERNAME,
  password: process.env.PASSWORD
};
```

### Option 2: Environment Variables
Set environment variables in your shell:

```bash
# macOS/Linux
export BASE_URL="http://localhost:3000/"
export USERNAME="csimpy@diligent.com"
export PASSWORD="Charu@123"

# Windows (Command Prompt)
set BASE_URL=http://localhost:3000/
set USERNAME=csimpy@diligent.com
set PASSWORD=Charu@123

# Windows (PowerShell)
$env:BASE_URL="http://localhost:3000/"
$env:USERNAME="csimpy@diligent.com"
$env:PASSWORD="Charu@123"
```

## 🌍 Multiple Environments

### Setup for Dev/Staging/Prod

Create separate config files:

**playwright.env.dev.js**
```javascript
module.exports = {
  baseUrl: 'https://dev.example.com',
  username: 'dev-user@example.com',
  password: 'dev-password'
};
```

**playwright.env.staging.js**
```javascript
module.exports = {
  baseUrl: 'https://staging.example.com',
  username: 'staging-user@example.com',
  password: 'staging-password'
};
```

**playwright.env.prod.js**
```javascript
module.exports = {
  baseUrl: 'https://prod.example.com',
  username: 'prod-user@example.com',
  password: 'prod-password'
};
```

### Using Different Environments

Update package.json scripts:
```json
{
  "scripts": {
    "test:dev": "ENV=dev playwright test",
    "test:staging": "ENV=staging playwright test",
    "test:prod": "ENV=prod playwright test"
  }
}
```

Update your config loader:
```javascript
const env = process.env.ENV || 'dev';
const config = require(`./playwright.env.${env}.js`);
module.exports = config;
```

## 🔑 Using Credentials in Tests

### Current Usage (Page Object)
```javascript
const config = require('../../playwright.env');

class LoginPage {
  async loginIntoTpmAI(
    username = config.username, 
    password = config.password
  ) {
    await this.emailInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

### Direct Usage in Tests
```javascript
const config = require('../playwright.env');

test('login test', async ({ page }) => {
  await page.goto(config.baseUrl);
  await page.fill('#email', config.username);
  await page.fill('#password', config.password);
  await page.click('button[type="submit"]');
});
```

## 🎯 Configuration in playwright.config.js

The main config file uses baseURL:
```javascript
use: {
  baseURL: 'https://app.poctpm-ai.diligentoneplatform-dev.com',
}
```

This allows shorter navigation:
```javascript
// Instead of full URL
await page.goto('http://localhost:3000/dashboard');

// Use relative path
await page.goto('/dashboard');
```

## 🔒 CI/CD Setup

### GitHub Actions
```yaml
env:
  BASE_URL: ${{ secrets.BASE_URL }}
  USERNAME: ${{ secrets.USERNAME }}
  PASSWORD: ${{ secrets.PASSWORD }}

steps:
  - name: Run tests
    run: npm test
```

### GitLab CI
```yaml
variables:
  BASE_URL: $BASE_URL
  USERNAME: $USERNAME
  PASSWORD: $PASSWORD

test:
  script:
    - npm test
```

Store secrets in your CI/CD platform's secret management.

## 📝 Additional Environment Variables

You can add more configuration as needed:

```javascript
module.exports = {
  baseUrl: 'http://localhost:3000/',
  username: 'csimpy@diligent.com',
  password: 'Charu@123',
  
  // API endpoints
  apiUrl: 'https://api.example.com',
  
  // Timeouts
  defaultTimeout: 30000,
  apiTimeout: 10000,
  
  // Feature flags
  enableNewFeature: true,
  
  // Test data
  testOrgId: '12345',
  testProjectId: '67890'
};
```

## ⚠️ Important Notes

1. **Never commit credentials** to version control
2. Add `playwright.env.js` to `.gitignore` if it contains real credentials
3. Use different credentials for test environments vs production
4. Consider using a password manager or secret management service
5. Rotate credentials regularly
6. Use environment-specific accounts with minimal permissions

## 🔍 Troubleshooting

### Config not loading
```javascript
// Add logging to debug
const config = require('./playwright.env');
console.log('Loaded config:', config);
```

### Environment variable not set
```javascript
// Add validation
if (!config.username || !config.password) {
  throw new Error('Username or password not configured');
}
```

---

**Security Reminder**: Always keep credentials secure and never share them in public repositories!

