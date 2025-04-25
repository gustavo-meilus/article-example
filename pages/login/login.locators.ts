import { Page } from '@playwright/test';

export const onLoadLocators = (page: Page) => ({
    usernameTextbox: page.getByRole('textbox', { name: 'Username' }),
    passwordTextbox: page.getByRole('textbox', { name: 'Password' }),
    loginButton: page.getByRole('button', { name: 'Login' }),
    languagesButton: page.getByRole('button').filter({ hasText: /^$/ }),
});

export const locators = (page: Page) => ({
    ...onLoadLocators(page),
    languageList: page.getByRole('list'),
   });

export type OnLoadLocators = ReturnType<typeof onLoadLocators>;
export type Locators = ReturnType<typeof onLoadLocators> & ReturnType<typeof locators>;