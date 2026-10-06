import { test, expect } from '@playwright/test';

const USERNAME = 'designminimal@abv.bg';
const PASSWORD = 'Supersecretpassword1!';

test.describe('Reserved Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const cookieSelectors = [
      '#cookiebotDialogOkButton',
      '#onetrust-accept-btn-handler',
      '[data-testid="cookie-accept"]',
    ];
    for (const sel of cookieSelectors) {
      try {
        const btn = page.locator(sel);
        if (await btn.count() > 0) {
          await btn.first().click();
          await page.waitForTimeout(1000);
          break;
        }
      } catch {}
    }
  });

  test('login with valid credentials', async ({ page }) => {
    const loginBtn = page.locator('a:has-text("LOG IN"), a:has-text("Log In"), a:has-text("log in"), button:has-text("LOG IN")').first();
    await expect(loginBtn).toBeVisible({ timeout: 15000 });
    await loginBtn.click();

    const usernameField = page.locator('input[name="logonId"], input[name="login"], input[name="username"], input[type="email"], input#login_username').first();
    const passwordField = page.locator('input[name="password"], input[type="password"]').first();

    await expect(usernameField).toBeVisible({ timeout: 15000 });
    await usernameField.fill(USERNAME);
    await passwordField.fill(PASSWORD);

    const submitBtn = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Sign In"), button:has-text("log in")').first();
    await expect(submitBtn).toBeVisible({ timeout: 10000 });
    await submitBtn.click();

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const url = page.url();
    console.log('After login URL:', url);
    expect(url).not.toContain('login');
  });

  test('login invalid credentials', async ({ page }) => {
    const loginBtn = page.locator('a:has-text("LOG IN"), a:has-text("Log In")').first();
    await expect(loginBtn).toBeVisible({ timeout: 15000 });
    await loginBtn.click();

    const usernameField = page.locator('input[name="logonId"], input[name="login"], input[name="username"], input[type="email"]').first();
    const passwordField = page.locator('input[name="password"], input[type="password"]').first();

    await usernameField.fill('wrong@test.com');
    await passwordField.fill('wrongpassword');

    const submitBtn = page.locator('button[type="submit"], button:has-text("Sign in")').first();
    await submitBtn.click();

    await page.waitForTimeout(2000);
    const url = page.url();
    console.log('After invalid login URL:', url);
  });
});