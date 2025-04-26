import { expect, test, tags } from '../../fixtures';

test.beforeEach(async ({ app }) => {
    app.context.clearCookies();
});

test(
    'check login screen loading',
    {
        tag: tags(__filename),
    },
    async ({ app }) => {
        await app.login.goto();
        const promises = Object.entries(app.login.onLoadLocators).map(
            (element) => {
                return expect(element[1]).toBeVisible();
            },
        );
        await Promise.all(promises);
    },
);

test(
    'check auth login',
    {
        tag: tags(__filename),
    },
    async ({ app }) => {
        await app.login.goto();
        await app.login.executeLogin(
            process.env.USER_NAME!,
            process.env.PASSWORD!,
        );
        await app.page.waitForURL('./vue-element-admin/#/dashboard');
    },
);

test(
    'change login language to spanish',
    { tag: tags(__filename) },
    async ({ app }) => {
        await app.login.goto();
        await app.login.changeLanguage('Español');
        await expect(app.page.getByText('Formulario de acceso')).toBeVisible();
    },
);
