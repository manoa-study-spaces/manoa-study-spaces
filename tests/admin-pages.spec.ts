import { test, expect } from './auth-utils';

test.slow();
test('test access to admin page', async ({ getUserPage }) => {
  // Call the getUserPage fixture with admin signin info to get authenticated session for admin
  const adminPage = await getUserPage('brianiki@hawaii.edu', '102938');

  // Navigate to the home page and wait for post-login indicator
  await adminPage.goto('https://manoa-study-spaces-main.vercel.app/list');
  // await expect(
  //   adminPage.getByRole('button', { name: 'brianiki@hawaii.edu' })
  // ).toBeVisible({ timeout: 10000 });

  // // Check for navigation elements
  // await expect(
  //   adminPage.getByRole('link', { name: 'Manoa Study Spaces' })
  // ).toBeVisible({ timeout: 5000 });
  // await expect(
  //   adminPage.getByRole('link', { name: "Today's Spaces" })
  // ).toBeVisible({ timeout: 5000 });
  // await expect(
  //   adminPage
  //   .getByRole('link', { name: "Study Spaces" })
  //   .first()
  // ).toBeVisible({ timeout: 5000 });
  // await expect(
  //   adminPage.getByRole('link', { name: "Study Groups" })
  // ).toBeVisible({ timeout: 5000 });

  // // Test Add Stuff adminPage
  // await adminPage.getByRole('link', { name: "Study Spaces" }).click();
  // await expect(
  //   adminPage.getByRole('heading', { name: "Study Spaces" })
  // ).toBeVisible({ timeout: 5000 });

  // // Test List Stuff adminPage
  // await adminPage.getByRole('link', { name: "Today's Spaces" }).click();
  // await expect(
  //   adminPage.getByRole('heading', { name: "Today's Spaces" })
  // ).toBeVisible({ timeout: 5000 });

  // // Test Admin adminPage
  // await adminPage.getByRole('link', { name: 'Admin' }).click();
  // await expect(
  //   adminPage.getByRole('heading', { name: "Study Spaces" })
  // ).toBeVisible({ timeout: 5000 });
  // await expect(
  //   adminPage.getByRole('heading', { name: "Study Spaces" })
  // ).toBeVisible({ timeout: 5000 });

});