import { Locator } from '@playwright/test';

export const onLoadLocators = (container: Locator) => ({
    // Note: Parent locators are not included since we're now scoped to the table container
    // Order table elements
    orderTable: container,
    orderTableHeaders: container.getByRole('row').first(),
});

export const locators = (container: Locator) => ({
    ...onLoadLocators(container),
    // Additional dynamic locators
    orderRows: container
        .getByRole('row')
        .filter({ hasNotText: 'Order_No Price Status' }),
});

export type OnLoadLocators = ReturnType<typeof onLoadLocators>;
export type Locators = ReturnType<typeof locators>;
