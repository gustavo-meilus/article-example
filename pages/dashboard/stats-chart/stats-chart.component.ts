import { Locator, Page } from '@playwright/test';
import { DonutChartBase } from '../../common/base/donut-chart.base';
import { locators, onLoadLocators } from './stats-chart.locators';

export class StatsChartComponent extends DonutChartBase {
    readonly onLoadLocators: Record<string, Locator>;
    readonly locators: Record<string, Locator>;
    readonly container: Locator;

    constructor(page: Page) {
        super(page);
        this.container = page.getByRole('region', { name: 'Statistics Chart' });
        this.locators = locators(this.container);
        this.onLoadLocators = onLoadLocators(this.container);
    }
}
