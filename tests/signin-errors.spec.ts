import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

test('shows a specific message when email does not exist', async ({ page }) => {
  await page.goto(`${BASE_URL}/auth/signin`);

  await page.locator('input[name="email"]').fill('missing-user@foo.com');
  await page.locator('input[name="password"]').fill('changeme');
  await page.getByRole('button', { name: /log[ -]?in/i }).click();

  await expect(page.getByText('No account found with that email address.')).toBeVisible();
});

test('shows a specific message when password is incorrect', async ({ page }) => {
  await page.goto(`${BASE_URL}/auth/signin`);

  await page.locator('input[name="email"]').fill('john@foo.com');
  await page.locator('input[name="password"]').fill('wrong-password');
  await page.getByRole('button', { name: /log[ -]?in/i }).click();

  await expect(page.getByText('Incorrect password. Please try again.')).toBeVisible();
});
