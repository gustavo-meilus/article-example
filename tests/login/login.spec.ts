import { expect, test, tags } from '../../fixtures';

test(
    'check auth login',
    {
        tag: tags(__filename),
    },
    async ({ app }) => {
        await app.login.goto();
        await expect(app.page.getByText('Dashboard').first()).toBeVisible();
    },
);
