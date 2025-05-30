import { Locator, Page } from '@playwright/test';
import { LineChartBase } from '../../common/base/line-chart.base';
import { locators, onLoadLocators } from './areas-chart.locators';

export class AreasChartComponent extends LineChartBase {
    readonly onLoadLocators: Record<string, Locator>;
    readonly locators: Record<string, Locator>;
    readonly container: Locator;

    constructor(page: Page) {
        super(page);
        this.container = page.getByRole('region', { name: 'Areas Chart' });
        this.locators = locators(this.container);
        this.onLoadLocators = onLoadLocators(this.container);
    }
}
