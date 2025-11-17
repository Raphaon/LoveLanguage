import { test, expect } from '@playwright/test';

test.describe.skip('CupidArrow smoke', () => {
  test('loads gestures page and focuses filters', async ({ page }) => {
    await page.goto('http://localhost:8100/gestures');
    await expect(page.locator('text=Suggestions personnalisées')).toBeVisible();
    await page.keyboard.press('Tab');
  });
});
