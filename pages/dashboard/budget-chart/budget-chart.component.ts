import { Locator, Page } from '@playwright/test';
import { RadarChartBase } from '../../common/base/radar-chart.base';
import { locators, onLoadLocators } from './budget-chart.locators';

export class BudgetChartComponent extends RadarChartBase {
    readonly onLoadLocators: Record<string, Locator>;
    readonly locators: Record<string, Locator>;
    readonly container: Locator;

    constructor(page: Page) {
        super(page);
        this.container = page.getByRole('region', { name: 'Budget Chart' });
        this.locators = locators(this.container);
        this.onLoadLocators = onLoadLocators(this.container);
    }
}
