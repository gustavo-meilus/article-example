import { Page } from '@playwright/test';

export const onLoadLocators = (page: Page) => ({
    // Add on load locators
});

// Additional locators that might appear after interactions
export const locators = (page: Page) => ({
    ...onLoadLocators(page),
});

export type OnLoadLocators = ReturnType<typeof onLoadLocators>;
export type Locators = ReturnType<typeof locators>;
