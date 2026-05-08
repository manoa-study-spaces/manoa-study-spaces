import { test, expect } from './auth-utils';

test.slow();
test('test access to admin page', async ({ getUserPage }) => {
  // Call the getUserPage fixture with admin signin info to get authenticated session for admin
  const adminPage = await getUserPage('brianiki@hawaii.edu', '102938');

  // Navigate to the home page and wait for post-login indicator
  await adminPage.goto('https://manoa-study-spaces-main.vercel.app/list');
   // Navigate to the home page and wait for post-login indicator
  await adminPage.goto('https://manoa-study-spaces-main.vercel.app');
  await expect(
    adminPage
  ).toHaveTitle('Manoa Study Spaces');

  // Now check for navigation links and headings
  await expect(
    adminPage).toHaveURL('https://manoa-study-spaces-main.vercel.app/list');
  await expect(
    adminPage).toHaveURL('https://manoa-study-spaces-main.vercel.app/groups');

  await adminPage.goto('https://manoa-study-spaces-main.vercel.app/list');

  await expect(
    adminPage).toHaveURL('https://manoa-study-spaces-main.vercel.app/add');


});