import { test, expect } from './auth-utils';

test.slow();
test('can authenticate a specific user', async ({ getUserPage }) => {

  // Call the getUserPage fixture with users signin info to get authenticated session for user
  const customUserPage = await getUserPage('brianiki@hawaii.edu', '102938');

  // Navigate to the home page and wait for post-login indicator
  await customUserPage.goto('https://manoa-study-spaces-powwrfvsx-brians-projects-1f312bea.vercel.app/');
  await expect(
    customUserPage.getByRole('button', { name: 'brianiki@hawaii.edu' })
  ).toBeVisible({ timeout: 10000 });

  // Now check for navigation links and headings
  await expect(
    customUserPage.getByRole('link', { name: "Study Spaces" })
  ).toBeVisible({ timeout: 5000 });
  await expect(
    customUserPage.getByRole('link', { name: "Today's Spaces" })
  ).toBeVisible({ timeout: 5000 });

  await customUserPage.getByRole('link', { name: "Study Spaces" }).click();
  await expect(
    customUserPage.getByRole('heading', { name: "Study Spaces" })
  ).toBeVisible({ timeout: 5000 });

  await customUserPage.getByRole('link', { name: "Today's Spaces" }).click();
  await expect(
    customUserPage.getByRole('heading', { name: "Today's Spaces" })
  ).toBeVisible({ timeout: 5000 });

});
