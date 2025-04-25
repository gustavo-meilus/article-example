import { Locator, Page } from '@playwright/test';
import { RadarChartBase } from '../../common/components/radar-chart.base';
import {
    Locators,
    locators,
    OnLoadLocators,
    onLoadLocators,
} from './order-table.locators';

export class OrderTableComponent extends RadarChartBase {
    readonly onLoadLocators: OnLoadLocators;
    readonly locators: Locators;
    readonly container: Locator;

    constructor(page: Page) {
        super(page);
        this.container = page.getByRole('table').first();
        this.locators = locators(this.container);
        this.onLoadLocators = onLoadLocators(this.container);
    }
}
