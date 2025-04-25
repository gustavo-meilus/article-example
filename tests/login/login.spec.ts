import { expect, test } from '../../fixtures';

test('check auth login', async ({ app }) => {
    await app.login.goto();
    await expect(app.page.getByText('Dashboard').first()).toBeVisible();
});
