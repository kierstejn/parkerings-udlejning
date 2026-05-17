import { Browser, Page } from '@playwright/test';

export const AUTH_FILE = 'e2e/.auth/user.json';
export const TEST_EMAIL = 'test@example.com';
export const TEST_PASSWORD = 'password';

export async function resetDb(page: Page): Promise<void> {
    const res = await page.request.post('/test/db/reset');
    if (!res.ok()) throw new Error(`DB reset failed: ${res.status()}`);
}

export async function createSpot(page: Page, attrs: Record<string, unknown> = {}): Promise<{ id: number; title: string }> {
    const res = await page.request.post('/test/spots/create', { data: attrs });
    if (!res.ok()) throw new Error(`Spot creation failed: ${res.status()}`);
    return res.json();
}

export async function resetAndAuth(browser: Browser) {
    const ctx = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await ctx.newPage();

    await resetDb(page);

    // Register test user
    await page.goto('/register');
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill(TEST_EMAIL);
    await page.locator('#password').fill(TEST_PASSWORD);
    await page.locator('#password_confirmation').fill(TEST_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/profile/);

    await ctx.storageState({ path: AUTH_FILE });
    await ctx.close();
}
