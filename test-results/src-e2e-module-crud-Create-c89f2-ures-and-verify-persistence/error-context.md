# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: src/e2e/module-crud.spec.ts >> Create nested module with features and verify persistence
- Location: src/e2e/module-crud.spec.ts:17:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="email"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - link "RealBiz home" [ref=e5] [cursor=pointer]:
          - /url: /
          - img "RealBiz logo" [ref=e6]
        - navigation [ref=e7]:
          - link "Home" [ref=e8] [cursor=pointer]:
            - /url: /
          - link "Features" [ref=e9] [cursor=pointer]:
            - /url: /features
          - link "Pricing" [ref=e10] [cursor=pointer]:
            - /url: /pricing
          - link "About" [ref=e11] [cursor=pointer]:
            - /url: /about
          - link "Contact" [ref=e12] [cursor=pointer]:
            - /url: /contact
        - generic [ref=e13]:
          - generic [ref=e14]:
            - button "English" [ref=e15]: EN
            - button "বাংলা" [ref=e16]: BN
          - button "Dark" [ref=e17]
    - main [ref=e20]:
      - generic [ref=e22]:
        - generic [ref=e23]:
          - img "Make smarter decisions with real-time insights." [ref=e25]
          - generic [ref=e28]:
            - generic [ref=e29]: BUSINESS INTELLIGENCE
            - button "← Back" [ref=e31]
          - generic [ref=e32]:
            - generic [ref=e33]:
              - paragraph [ref=e34]: RealBiz Admin Platform
              - heading "Make smarter decisions with real-time insights." [level=2] [ref=e35]
              - paragraph [ref=e36]: Monitor business performance, analyze costs, track cash flow, and turn your data into actionable decisions.
            - generic [ref=e37]:
              - button "Go to slide 1" [ref=e38]
              - button "Go to slide 2" [ref=e40]
              - button "Go to slide 3" [ref=e42]
            - generic [ref=e44]:
              - generic [ref=e45]: Enterprise Grade Security
              - generic [ref=e46]: RealBiz Admin Portal
        - generic [ref=e48]:
          - generic [ref=e49]:
            - heading "Super Admin Login" [level=1] [ref=e50]
            - paragraph [ref=e51]: Enter your credentials to access the platform administrative console.
          - generic [ref=e52]:
            - generic [ref=e53]: "Quick Fill:"
            - button "Super Admin Demo" [ref=e54]
          - generic [ref=e58]:
            - generic [ref=e59]:
              - generic [ref=e60]:
                - generic [ref=e61]: Email or Username
                - button "Fill Super Admin" [ref=e62]
              - textbox "Email or Username" [ref=e63]:
                - /placeholder: admin@admin.com
            - generic [ref=e64]:
              - text: Password
              - textbox "Password" [ref=e65]:
                - /placeholder: ••••••••
            - button "Sign In to Admin" [ref=e66]
          - generic [ref=e70]:
            - link "← Return to main site" [ref=e71] [cursor=pointer]:
              - /url: /
            - link "Regular Workspace Login →" [ref=e72] [cursor=pointer]:
              - /url: /rb/login
    - contentinfo [ref=e73]:
      - generic [ref=e74]:
        - generic [ref=e75]:
          - generic [ref=e76]:
            - link "RealBiz home" [ref=e77] [cursor=pointer]:
              - /url: /
              - img "RealBiz logo" [ref=e78]
            - paragraph [ref=e79]: © 2026 RealBiz. Built for operators, not just owners.
          - generic [ref=e80]:
            - heading "Product" [level=4] [ref=e81]
            - navigation [ref=e82]:
              - link "Features" [ref=e83] [cursor=pointer]:
                - /url: /features
              - link "About Us" [ref=e84] [cursor=pointer]:
                - /url: /about
              - link "Contact" [ref=e85] [cursor=pointer]:
                - /url: /contact
          - generic [ref=e86]:
            - heading "Company" [level=4] [ref=e87]
            - navigation [ref=e88]:
              - link "Careers" [ref=e89] [cursor=pointer]:
                - /url: /careers
              - link "Blog" [ref=e90] [cursor=pointer]:
                - /url: /blog
              - link "Press" [ref=e91] [cursor=pointer]:
                - /url: /press
          - generic [ref=e92]:
            - heading "Bangladesh Contact" [level=4] [ref=e93]
            - generic [ref=e94]:
              - generic [ref=e95]:
                - paragraph [ref=e96]: "Bangladesh Address:"
                - generic [ref=e97]: H-417, R-7, Baridhara DOHS, Dhaka-1206
              - link "+8801897-621270" [ref=e106] [cursor=pointer]:
                - /url: tel:+8801897621270
              - generic [ref=e107]:
                - link "fleekbangladesh@gmail.com" [ref=e112] [cursor=pointer]:
                  - /url: mailto:fleekbangladesh@gmail.com
                - link "info@fleek.com.bd" [ref=e114] [cursor=pointer]:
                  - /url: mailto:info@fleek.com.bd
        - generic [ref=e115]:
          - paragraph [ref=e116]: © 2026 RealBiz. Built for operators, not just owners.
          - generic [ref=e117]:
            - link "Twitter" [ref=e118] [cursor=pointer]:
              - /url: https://twitter.com
            - link "LinkedIn" [ref=e121] [cursor=pointer]:
              - /url: https://linkedin.com
            - link "GitHub" [ref=e124] [cursor=pointer]:
              - /url: https://github.com
  - button [ref=e128]
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e137] [cursor=pointer]
  - alert [ref=e141]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | // Super admin credentials (default)
  4  | const SUPER_ADMIN_EMAIL = 'admin@example.com';
  5  | const SUPER_ADMIN_PASSWORD = 'admin123';
  6  | 
  7  | // Helper to login as super admin
  8  | async function login(page) {
  9  |   await page.goto('http://localhost:3000/login');
> 10 |   await page.fill('input[name="email"]', SUPER_ADMIN_EMAIL);
     |              ^ Error: page.fill: Test timeout of 30000ms exceeded.
  11 |   await page.fill('input[name="password"]', SUPER_ADMIN_PASSWORD);
  12 |   await page.click('button[type="submit"]');
  13 |   // Wait for navigation to dashboard
  14 |   await page.waitForURL('**/dashboard');
  15 | }
  16 | 
  17 | test('Create nested module with features and verify persistence', async ({ page }) => {
  18 |   // Login
  19 |   await login(page);
  20 | 
  21 |   // Navigate to module creation page (assumed route)
  22 |   await page.goto('http://localhost:3000/modules/create');
  23 | 
  24 |   // Fill module details
  25 |   const moduleName = `TestModule-${Date.now()}`;
  26 |   await page.fill('input[name="name"]', moduleName);
  27 |   await page.fill('input[name="code"]', `MOD_${Date.now()}`);
  28 |   await page.click('button[type="submit"]'); // Save module
  29 | 
  30 |   // Wait for module list to show the new module
  31 |   await page.waitForSelector(`text=${moduleName}`);
  32 | 
  33 |   // Open the newly created module to add nested features
  34 |   await page.click(`text=${moduleName}`);
  35 | 
  36 |   // Click add feature button (assumed selector)
  37 |   await page.click('button[data-test-id="add-feature"]');
  38 | 
  39 |   // Fill feature details – only read and write actions
  40 |   const featureName = `Feature-${Date.now()}`;
  41 |   await page.fill('input[name="featureName"]', featureName);
  42 |   await page.fill('input[name="featureCode"]', `FEAT_${Date.now()}`);
  43 |   // Uncheck all action checkboxes first (if any are pre‑checked)
  44 |   const actions = ['read', 'write', 'update', 'delete'];
  45 |   for (const a of actions) {
  46 |     const checkbox = page.locator(`input[name="actions"] >> nth=${actions.indexOf(a)}`);
  47 |     if (await checkbox.isChecked()) {
  48 |       await checkbox.uncheck();
  49 |     }
  50 |   }
  51 |   // Check only read and write
  52 |   await page.check('input[name="actions"][value="read"]');
  53 |   await page.check('input[name="actions"][value="write"]');
  54 | 
  55 |   // Save feature
  56 |   await page.click('button[data-test-id="save-feature"]');
  57 | 
  58 |   // Verify feature appears in the module tree
  59 |   await page.waitForSelector(`text=${featureName}`);
  60 | 
  61 |   // Reload the page to verify persistence
  62 |   await page.reload();
  63 |   await page.waitForURL('**/dashboard');
  64 |   await page.waitForSelector(`text=${moduleName}`);
  65 |   await page.click(`text=${moduleName}`);
  66 |   await page.waitForSelector(`text=${featureName}`);
  67 | 
  68 |   // Navigate to regular dashboard and verify module appears with nested feature
  69 |   await page.goto('http://localhost:3000/dashboard');
  70 |   await page.waitForSelector(`text=${moduleName}`);
  71 |   await page.click(`text=${moduleName}`);
  72 |   await page.waitForSelector(`text=${featureName}`);
  73 | });
  74 | 
```