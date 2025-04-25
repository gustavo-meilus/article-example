import { Locator } from '@playwright/test';

export const onLoadLocators = (container: Locator) => ({
    breadcrumbNav: container.getByRole('navigation', { name: 'Breadcrumb' }),
    breadcrumbDashboardLink: container.getByRole('link', { name: 'Dashboard' }),
    searchInput: container.getByRole('textbox', { name: 'Search' }),
    hamburgerButton: container
        .getByRole('button')
        .filter({ hasText: '' })
        .first(),
    screenfullButton: container.getByRole('button').nth(1),
    sizeSelectButton: container.getByRole('button').nth(2),
    languageButton: container.getByRole('button').nth(3),
    avatarButton: container.getByRole('button').filter({ hasText: '' }).last(),
});

export const locators = (container: Locator) => ({
    ...onLoadLocators(container),
    // Additional locators that might appear after interactions
    searchDropdown: container.getByRole('listbox'),
    languageDropdown: container.getByRole('list'),
    userDropdown: container.getByRole('menu'),
});

export type OnLoadLocators = ReturnType<typeof onLoadLocators>;
export type Locators = ReturnType<typeof locators>;
