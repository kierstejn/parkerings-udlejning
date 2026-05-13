import { test, expect } from '@playwright/test';
import { AUTH_FILE, resetAndAuth } from './helpers/auth';

test.use({ storageState: AUTH_FILE });

test.beforeAll(async ({ browser }) => {
    await resetAndAuth(browser);
});

test('authenticated user sees profile page', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/profile/);
});

test('unauthenticated user is redirected to login', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await ctx.newPage();
    await page.goto('/profile');
    await expect(page).toHaveURL(/login/);
    await ctx.close();
});

test('user can log out', async ({ page }) => {
    await page.goto('/profile');
    await page.locator('form[action*="logout"] button, button:has-text("Log ud"), button:has-text("Log out")').first().click();
    await expect(page).toHaveURL('/');
});
