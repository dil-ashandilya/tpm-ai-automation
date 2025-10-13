# How to Run Playwright Tests

## ✅ One-Time Setup (Already Done!)

```bash
cd /Users/csimpy/Desktop/CS_Test/TPMAI/UI_Playwright
npm install
npx playwright install
```

## 🚀 Running Tests

### **Method 1: UI Mode (RECOMMENDED)** ⭐
Best for development and debugging - shows visual interface with time-travel debugging:

```bash
npm run test:ui
```

**What you'll see:**
- Visual test explorer
- Watch tests run in real-time
- Step through actions
- View DOM snapshots at each step
- See network requests
- Perfect for development!

---

### **Method 2: Headed Mode**
Run tests with visible browser windows:

```bash
npm run test:headed
```

**When to use:** Want to see the browser but don't need interactive debugging

---

### **Method 3: Headless Mode (Default)**
Run tests in background without opening browser:

```bash
npm test
```

**When to use:** Running all tests quickly, CI/CD pipelines

---

### **Method 4: Run and View Report**
Run tests and automatically open HTML report:

```bash
npm run test:report
```

After tests finish, report opens automatically with:
- Test results
- Screenshots
- Videos (if any failures)
- Trace viewer

---

### **Method 5: Debug Mode**
Step through tests one action at a time:

```bash
npm run test:debug
```

**When to use:** Investigating test failures

---

## 🎯 Running Specific Tests

### Run a specific test file
```bash
npx playwright test tests/TPMAI/login.spec.js
```

### Run tests matching a pattern
```bash
npx playwright test login
```

### Run only TPMAI tests
```bash
npx playwright test tests/TPMAI/
```

---

## 🌐 Running in Specific Browsers

### Chromium only
```bash
npm run test:chrome
```

### Firefox only
```bash
npm run test:firefox
```

### WebKit (Safari) only
```bash
npm run test:webkit
```

### All browsers
```bash
npm run test:all-browsers
```

---

## 📊 Viewing Reports

### After running tests, view the report:
```bash
npm run show:report
```

Or manually open:
```bash
open playwright-report/index.html
```

---

## 🔥 Quick Commands Summary

| What You Want | Command |
|---------------|---------|
| **Best for development** | `npm run test:ui` |
| **Quick test run** | `npm test` |
| **See browser** | `npm run test:headed` |
| **Debug failing test** | `npm run test:debug` |
| **Run + see report** | `npm run test:report` |
| **View existing report** | `npm run show:report` |
| **Test one file** | `npx playwright test path/to/file.spec.js` |

---

## 💡 Pro Tips

1. **Start with UI Mode**: `npm run test:ui` gives you the best development experience
2. **Use Headed Mode** when you want to see what's happening without full UI
3. **Use Headless Mode** for quick validation or CI/CD
4. **Check Reports** after headless runs to see what happened

---

## 🎬 Example Workflow

```bash
# Open UI mode to develop/debug
npm run test:ui

# Run all tests headless when ready
npm test

# View the report
npm run show:report
```

---

## ❓ Troubleshooting

### Tests fail?
1. Check `TROUBLESHOOTING.md`
2. Run in UI mode: `npm run test:ui`
3. Run in debug mode: `npm run test:debug`

### Browsers not installed?
```bash
npm run install:browsers
```

### Need to update?
```bash
npm install @playwright/test@latest
npx playwright install
```

---

**Ready to go!** 🚀 Start with `npm run test:ui` to see the interactive test runner!

