import { test, expect } from '@playwright/test';

const USERNAME = 'designminimal@abv.bg';
const PASSWORD = 'Supersecretpassword1!';

test.describe('Reserved Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    try {
      const accept = page.locator('#cookiebotDialogOkButton');
      await accept.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      await accept.click().catch(() => {});
    } catch {}
  });

  test('login with valid credentials', async ({ page }) => {
    await page.getByRole('link', { name: /log in/i }).click();
    await page.locator('input[name="logonId"]').fill(USERNAME);
    await page.locator('input[name="password"]').fill(PASSWORD);
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/(account|customer)/i, { timeout: 30000 });
  });

  test('login invalid credentials', async ({ page }) => {
    await page.getByRole('link', { name: /log in/i }).click();
    await page.locator('input[name="logonId"]').fill('wrong@test.com');
    await page.locator('input[name="password"]').fill('wrong');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.url()).toContain('login');
  });
});