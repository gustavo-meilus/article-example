import { Locator, Page } from '@playwright/test';
import { RadarChartBase } from '../../common/base/radar-chart.base';
import { locators, onLoadLocators } from './order-table.locators';

export class OrderTableComponent extends RadarChartBase {
    readonly onLoadLocators: Record<string, Locator>;
    readonly locators: Record<string, Locator>;
    readonly container: Locator;

    constructor(page: Page) {
        super(page);
        this.container = page.getByRole('table').first();
        this.locators = locators(this.container);
        this.onLoadLocators = onLoadLocators(this.container);
    }
}
