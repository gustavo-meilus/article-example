import { expect, test, tags } from '../../fixtures';

test(
    'check header menu loading',
    {
        tag: tags(__filename),
    },
    async ({ app }) => {
        await app.headerMenu.goto();
        const promises = Object.entries(app.headerMenu.onLoadLocators).map(
            (element) => {
                return expect(element[1]).toBeVisible();
            },
        );
        await Promise.all(promises);
    },
);
