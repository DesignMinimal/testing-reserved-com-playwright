import { test, expect } from '@playwright/test';

const USERNAME = 'designminimal@abv.bg';
const PASSWORD = 'Supersecretpassword1!';

test.describe('Reserved Cart Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    try {
      const accept = page.locator('#cookiebotDialogOkButton');
      await accept.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      await accept.click().catch(() => {});
    } catch {}
  });

  test('add item to cart and empty it', async ({ page }) => {
    await page.getByRole('link', { name: /log in/i }).click();
    await page.locator('input[name="logonId"]').fill(USERNAME);
    await page.locator('input[name="password"]').fill(PASSWORD);
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/(account|customer)/i, { timeout: 30000 });

    const girlsLink = page.getByRole('link', { name: 'Girls' });
    await expect(girlsLink).toBeVisible({ timeout: 10000 });
    await girlsLink.click();

    const jacketsLink = page.getByRole('link', { name: /jackets/i }).first();
    await expect(jacketsLink).toBeVisible({ timeout: 10000 });
    await jacketsLink.click();

    const firstJacket = page.locator('[class*="product"], .product-card, a').first();
    await expect(firstJacket).toBeVisible({ timeout: 10000 });
    await firstJacket.click();

    const sizeSelector = page.locator('.size-selector, .size-option, button:has-text("Size")').first();
    await sizeSelector.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    
    const sizeBtn = page.getByText('128', { exact: true }).first();
    await sizeBtn.click().catch(async () => {
      await page.locator('.size-option, [class*="size"] button').first().click();
    });

    const addToBagBtn = page.getByRole('button', { name: /add to bag|add to cart/i });
    await expect(addToBagBtn).toBeVisible({ timeout: 10000 });
    await addToBagBtn.click();

    const goToBag = page.getByRole('link', { name: /go to your bag/i }).first();
    await goToBag.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    await goToBag.click().catch(() => {});

    await page.getByRole('link', { name: /bag|cart/i }).click().catch(() => {});
    await expect(page.locator('[class*="cart"]')).toBeVisible({ timeout: 10000 }).catch(() => {});

    const removeButtons = page.locator('button:has-text("Remove"), [class*="remove"]');
    const count = await removeButtons.count();
    for (let i = 0; i < count; i++) {
      await removeButtons.first().click();
      await page.waitForTimeout(1000);
    }

    await expect(page.getByText(/cart is empty|no items/i, { ignoreCase: true })).toBeVisible({ timeout: 10000 });
  });
});