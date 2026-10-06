import { test, expect } from '@playwright/test';

const USERNAME = 'designminimal@abv.bg';
const PASSWORD = 'Supersecretpassword1!';

test.describe('Reserved Cart Tests', () => {
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

  test('add item to cart and empty it', async ({ page }) => {
    // Login
    const loginBtn = page.locator('a:has-text("LOG IN"), a:has-text("Log In")').first();
    await expect(loginBtn).toBeVisible({ timeout: 15000 });
    await loginBtn.click();

    const usernameField = page.locator('input[name="logonId"], input[name="login"], input[name="username"], input[type="email"], input#login_username').first();
    const passwordField = page.locator('input[name="password"], input[type="password"]').first();

    await expect(usernameField).toBeVisible({ timeout: 15000 });
    await usernameField.fill(USERNAME);
    await passwordField.fill(PASSWORD);

    const submitBtn = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Sign In")').first();
    await expect(submitBtn).toBeVisible({ timeout: 10000 });
    await submitBtn.click();

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Navigate to Girls > Jackets, vests
    const girlsLink = page.locator('nav a:has-text("Girls"), nav a:has-text("girls"), .nav-link:has-text("Girls")').first();
    await expect(girlsLink).toBeVisible({ timeout: 15000 });
    await girlsLink.click();

    // Look for jackets link
    const jacketsLink = page.locator('a:has-text("Jackets"), a:has-text("Jackets, vests"), a:has-text("jackets")').first();
    await expect(jacketsLink).toBeVisible({ timeout: 15000 });
    await jacketsLink.click();

    // Select first product
    const firstJacket = page.locator('[class*="product"], .product-card, a[href*="product"], .product-tile').first();
    await expect(firstJacket).toBeVisible({ timeout: 15000 });
    await firstJacket.click();

    // Select size
    await page.waitForTimeout(2000);
    const sizeBtn = page.locator('button:has-text("Select size"), [class*="size-selector"], .size-option button, button[class*="size"]').first();
    await sizeBtn.click().catch(async () => {
      // Try clicking any visible size button
      const sizes = page.locator('button[class*="size"]');
      await sizes.first().click();
    });

    await page.waitForTimeout(1000);
    
    // Select specific size 128 or first available
    const size128 = page.getByText('128').first();
    await size128.click().catch(async () => {
      const allSizes = page.locator('.size-option, [class*="size"] button');
      await allSizes.first().click();
    });

    // Add to bag
    const addToBagBtn = page.locator('button:has-text("Add to bag"), button:has-text("Add to cart"), button[class*="add-to-cart"], button[class*="addToBag"]');
    await expect(addToBagBtn).toBeVisible({ timeout: 15000 });
    await addToBagBtn.click();

    // Go to bag
    await page.waitForTimeout(2000);
    const goToBagBtn = page.locator('a:has-text("Go to your bag"), a:has-text("View bag"), button:has-text("View bag"), a[class*="bag-link"]').first();
    await goToBagBtn.click().catch(() => {
      // Navigate via cart icon
      const cartIcon = page.locator('a:has-text("Bag"), a:has-text("bag"), [class*="cart-icon"]').first();
      cartIcon.click().catch(() => {});
    });

    await page.waitForTimeout(2000);

    // Remove all items
    const removeBtns = page.locator('button:has-text("Remove"), [class*="remove"], [data-testid*="remove"]');
    const count = await removeBtns.count();
    for (let i = 0; i < count; i++) {
      await page.locator('button:has-text("Remove"), [class*="remove"]').first().click();
      await page.waitForTimeout(1000);
    }

    // Verify cart empty
    await expect(page.getByText(/Your cart is empty|cart is empty|no items/i)).toBeVisible({ timeout: 15000 });
  });
});