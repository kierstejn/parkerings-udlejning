import { test, expect, Browser } from '@playwright/test';
import { AUTH_FILE, resetDb, createSpot, resetAndAuth } from './helpers/auth';

// ── Helpers ────────────────────────────────────────────────────────────────

async function guestContext(browser: Browser) {
    return browser.newContext({ storageState: { cookies: [], origins: [] } });
}

const FUTURE_AVAILABILITY = {
    starts_at:    '2027-06-01T00:00:00.000000Z',
    ends_at:      '2027-12-31T00:00:00.000000Z',
    booking_type: 'day',
    price:        150,
};

// ── Browse page (guest) ────────────────────────────────────────────────────

test.describe('Browse spots page', () => {
    let spotId: number;
    let spotTitle: string;

    test.beforeAll(async ({ browser }) => {
        const ctx  = await guestContext(browser);
        const page = await ctx.newPage();
        await resetDb(page);
        const spot = await createSpot(page, { title: 'Testplads i Østerbro', type: 'carport', size: 'standard' });
        spotId    = spot.id;
        spotTitle = spot.title;
        await ctx.close();
    });

    test('accessible to guests', async ({ browser }) => {
        const ctx  = await guestContext(browser);
        const page = await ctx.newPage();
        await page.goto('/spots');
        await expect(page).toHaveURL(/\/spots$/);
        await ctx.close();
    });

    test('shows spot card with title', async ({ browser }) => {
        const ctx  = await guestContext(browser);
        const page = await ctx.newPage();
        await page.goto('/spots');
        await expect(page.getByText(spotTitle)).toBeVisible();
        await ctx.close();
    });

    test('clicking card navigates to detail page', async ({ browser }) => {
        const ctx  = await guestContext(browser);
        const page = await ctx.newPage();
        await page.goto('/spots');
        await page.getByText(spotTitle).click();
        await expect(page).toHaveURL(new RegExp(`/spots/${spotId}$`));
        await ctx.close();
    });

    test('header shows log in for guests', async ({ browser }) => {
        const ctx  = await guestContext(browser);
        const page = await ctx.newPage();
        await page.goto('/spots');
        await expect(page.getByRole('link', { name: /log ind|log in/i }).first()).toBeVisible();
        await ctx.close();
    });
});

// ── Detail page (guest) ────────────────────────────────────────────────────

test.describe('Spot detail page — guest', () => {
    let spotId: number;
    let spotTitle: string;
    let spotWithAvailId: number;

    test.beforeAll(async ({ browser }) => {
        const ctx  = await guestContext(browser);
        const page = await ctx.newPage();
        await resetDb(page);

        const spot = await createSpot(page, { title: 'Garage i Frederiksberg', type: 'garage', size: 'large' });
        spotId    = spot.id;
        spotTitle = spot.title;

        const spotWithAvail = await createSpot(page, {
            title:        'Carport med tilgængelighed',
            type:         'carport',
            size:         'standard',
            availability: FUTURE_AVAILABILITY,
        });
        spotWithAvailId = spotWithAvail.id;

        await ctx.close();
    });

    test('renders spot title', async ({ browser }) => {
        const ctx  = await guestContext(browser);
        const page = await ctx.newPage();
        await page.goto(`/spots/${spotId}`);
        await expect(page.getByRole('heading', { name: spotTitle })).toBeVisible();
        await ctx.close();
    });

    test('back link returns to /spots', async ({ browser }) => {
        const ctx  = await guestContext(browser);
        const page = await ctx.newPage();
        await page.goto(`/spots/${spotId}`);
        await page.getByRole('link', { name: /alle pladser|all spots/i }).click();
        await expect(page).toHaveURL(/\/spots$/);
        await ctx.close();
    });

    test('unknown spot returns 404', async ({ browser }) => {
        const ctx  = await guestContext(browser);
        const page = await ctx.newPage();
        const response = await page.goto('/spots/999999');
        expect(response?.status()).toBe(404);
        await ctx.close();
    });

    test('shows login-to-book when availability exists', async ({ browser }) => {
        const ctx  = await guestContext(browser);
        const page = await ctx.newPage();
        await page.goto(`/spots/${spotWithAvailId}`);
        await expect(
            page.getByRole('link', { name: /log ind for at booke|log in to book/i })
        ).toBeVisible();
        await ctx.close();
    });

    test('no availability message shown when spot has no availability', async ({ browser }) => {
        const ctx  = await guestContext(browser);
        const page = await ctx.newPage();
        await page.goto(`/spots/${spotId}`);
        await expect(
            page.getByText(/ingen tilgængelighed|no availability/i)
        ).toBeVisible();
        await ctx.close();
    });
});

// ── Detail page (authenticated) ────────────────────────────────────────────

test.describe('Spot detail page — authenticated', () => {
    let spotId: number;
    let spotWithAvailId: number;

    test.beforeAll(async ({ browser }) => {
        // resetAndAuth resets the DB and registers a user
        await resetAndAuth(browser);

        const ctx  = await browser.newContext({ storageState: AUTH_FILE });
        const page = await ctx.newPage();

        const spot = await createSpot(page, { title: 'Plads uden tilgængelighed', type: 'outdoor', size: 'compact' });
        spotId = spot.id;

        const spotWithAvail = await createSpot(page, {
            title:        'Plads med booking',
            type:         'carport',
            size:         'standard',
            availability: FUTURE_AVAILABILITY,
        });
        spotWithAvailId = spotWithAvail.id;

        await ctx.close();
    });

    test('header shows Min side when logged in', async ({ browser }) => {
        const ctx  = await browser.newContext({ storageState: AUTH_FILE });
        const page = await ctx.newPage();
        await page.goto('/spots');
        await expect(page.getByRole('link', { name: /min side|my account/i })).toBeVisible();
        await ctx.close();
    });

    test('book button visible when availability exists', async ({ browser }) => {
        const ctx  = await browser.newContext({ storageState: AUTH_FILE });
        const page = await ctx.newPage();
        await page.goto(`/spots/${spotWithAvailId}`);
        await expect(
            page.getByRole('button', { name: /book pladsen|book this spot/i })
        ).toBeVisible();
        await ctx.close();
    });

    test('no login-to-book link shown when authenticated', async ({ browser }) => {
        const ctx  = await browser.newContext({ storageState: AUTH_FILE });
        const page = await ctx.newPage();
        await page.goto(`/spots/${spotWithAvailId}`);
        await expect(
            page.getByRole('link', { name: /log ind for at booke|log in to book/i })
        ).not.toBeVisible();
        await ctx.close();
    });
});
