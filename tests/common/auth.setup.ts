import { test as setup, expect } from '../../fixtures';
import path from 'path';

const authFile = path.join(__dirname, '../../.auth/user.json');

setup('authenticate', async ({ app }) => {
    await app.login.goto();
    await app.login.executeLogin(process.env.USER_NAME!, process.env.PASSWORD!);
    await app.page.waitForURL('./vue-element-admin/#/dashboard');
    await expect(app.page.getByText('Dashboard').first()).toBeVisible();

    // End of authentication steps.
    await app.page.context().storageState({ path: authFile });
});
