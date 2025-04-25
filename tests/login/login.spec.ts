import { expect, test } from '../../fixtures';

test('execute login', async ({ app }) => {
    await app.login.goto();
    await app.login.executeLogin(process.env.USER_NAME!, process.env.PASSWORD!);
    await app.page.waitForURL('./vue-element-admin/#/dashboard');
    await expect(app.page.getByText('Dashboard').first()).toBeVisible();
});
