import { test, expect } from './auth-utils';

test.slow();
test('can authenticate a specific user', async ({ getUserPage }) => {

  // Call the getUserPage fixture with users signin info to get authenticated session for user
  const customUserPage = await getUserPage('john@foo.com', 'changeme');

  // Navigate to the home page and wait for post-login indicator
  await customUserPage.goto('https://manoa-study-spaces-main.vercel.app');
  await expect(
    customUserPage
  ).toHaveTitle('Manoa Study Spaces');

  // Now check for navigation links and headings
  await expect(
    customUserPage).toHaveURL('https://manoa-study-spaces-main.vercel.app/');
  await expect(
    customUserPage).toHaveURL('https://manoa-study-spaces-main.vercel.app/');

  await customUserPage.goto('https://manoa-study-spaces-main.vercel.app/');

  await expect(
    customUserPage).toHaveURL('https://manoa-study-spaces-main.vercel.app/');


});
