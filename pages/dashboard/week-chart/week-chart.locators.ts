import { Locator } from '@playwright/test';

export const onLoadLocators = (container: Locator) => ({
    // Note: Parent locators are not included since we're now scoped to the chart container
    // Chart elements
    chartContainer: container,
    lineChart: container.locator('.echarts-for-react'),
});

export const locators = (container: Locator) => ({
    ...onLoadLocators(container),
    // Additional dynamic locators
    dataPoints: container.locator(
        '.echarts-for-react path[data-type="data-point"]',
    ),
    tooltips: container.locator('.echarts-tooltip'),
});

export type OnLoadLocators = ReturnType<typeof onLoadLocators>;
export type Locators = ReturnType<typeof locators>;
