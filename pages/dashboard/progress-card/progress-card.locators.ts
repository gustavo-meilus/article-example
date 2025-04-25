import { Locator } from '@playwright/test';

export const onLoadLocators = (container: Locator) => ({
    // Note: Parent locators are not included since we're now scoped to the progress card container
    // Progress section elements
    progressContainer: container,
    vueProgress: container.getByText('Vue').first(),
    javascriptProgress: container.getByText('JavaScript').first(),
    cssProgress: container.getByText('CSS').first(),
    eslintProgress: container.getByText('ESLint').first(),
});

export const locators = (container: Locator) => ({
    ...onLoadLocators(container),
    // Additional dynamic locators
    progressBars: container.getByRole('progressbar'),
});

export type OnLoadLocators = ReturnType<typeof onLoadLocators>;
export type Locators = ReturnType<typeof locators>;
