import { expect, test, tags } from '../../fixtures';

test(
    'check dashboard loading',
    {
        tag: tags(__filename),
    },
    async ({ app }) => {
        await app.dashboard.goto();
        const promises = Object.entries(app.dashboard.onLoadLocators).map(
            (element) => {
                return expect(element[1]).toBeVisible();
            },
        );
        await Promise.all(promises);
    },
);
