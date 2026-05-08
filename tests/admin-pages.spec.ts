import { test, expect } from './auth-utils';

test.slow();
test('test access to admin page', async ({ page }) => {
  // Call the getUserPage fixture with admin signin info to get authenticated session for admin
  // const page = await getUserPage('brianiki@hawaii.edu', '102938');

  // Navigate to the home page and wait for post-login indicator
  await page.goto('https://manoa-study-spaces-main.vercel.app/list');
   // Navigate to the home page and wait for post-login indicator
  await page.goto('https://manoa-study-spaces-main.vercel.app');
  await expect(
    page
  ).toHaveTitle('Manoa Study Spaces');

  // Now check for navigation links and headings
  await expect(
    page).toHaveURL('https://manoa-study-spaces-main.vercel.app/list');
  await expect(
    page).toHaveURL('https://manoa-study-spaces-main.vercel.app/groups');

  await page.goto('https://manoa-study-spaces-main.vercel.app/list');

  await expect(
    page).toHaveURL('https://manoa-study-spaces-main.vercel.app/add');


});