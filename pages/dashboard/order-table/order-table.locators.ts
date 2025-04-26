import { Locator } from '@playwright/test';

export const onLoadLocators = (container: Locator) => ({
    // Note: Parent locators are not included since we're now scoped to the chart container
});

// Additional locators that might appear after interactions
export const locators = (container: Locator) => ({
    ...onLoadLocators(container),
});

export type OnLoadLocators = ReturnType<typeof onLoadLocators>;
export type Locators = ReturnType<typeof locators>;
