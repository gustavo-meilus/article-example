import { Locator } from '@playwright/test';

export const onLoadLocators = (container: Locator) => ({
    hamburgerContainer: container.locator('#hamburger-container'),
    breadcrumbNav: container.getByLabel('Breadcrumb'),
    rightMenu: container.locator('.right-menu'),
    searchButton: container.locator('#header-search'),
    screenFullButton: container.locator('#screenfull'),
    sizeSelectButton: container.locator('#size-select'),
    languageButton: container.locator('.international'),
    accountButton: container.locator('.avatar-container'),
});

// Additional locators that might appear after interactions
export const locators = (container: Locator) => ({
    ...onLoadLocators(container),
    accountDropdown: container.locator('#dropdown-menu-193'),
});
