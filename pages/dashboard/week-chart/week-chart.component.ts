import { Locator, Page } from '@playwright/test';
import { BarChartBase } from '../../common/base/bar-chart.base';
import { locators, onLoadLocators } from './week-chart.locators';

export class WeekChartComponent extends BarChartBase {
    readonly onLoadLocators: Record<string, Locator>;
    readonly locators: Record<string, Locator>;
    readonly container: Locator;

    constructor(page: Page) {
        super(page);
        this.container = page.getByRole('region', { name: 'Week Chart' });
        this.locators = locators(this.container);
        this.onLoadLocators = onLoadLocators(this.container);
    }
}
