import { Locator, Page } from '@playwright/test';
import { BarChartBase } from '../../common/components/bar-chart.base';
import {
    Locators,
    locators,
    OnLoadLocators,
    onLoadLocators,
} from './week-chart.locators';

export class WeekChartComponent extends BarChartBase {
    readonly onLoadLocators: OnLoadLocators;
    readonly locators: Locators;
    readonly container: Locator;

    constructor(page: Page) {
        super(page);
        this.container = page.getByRole('region', { name: 'Week Chart' });
        this.locators = locators(this.container);
        this.onLoadLocators = onLoadLocators(this.container);
    }
}
