import { expect, tags, test } from '../../../fixtures';

test(
    'check left menu loading',
    {
        tag: tags(__filename),
    },
    async ({ app }) => {
        await app.leftMenu.goto();
        const promises = Object.entries(app.leftMenu.onLoadLocators).map(
            (element) => {
                return expect(element[1]).toBeVisible();
            },
        );
        await Promise.all(promises);
    },
);
