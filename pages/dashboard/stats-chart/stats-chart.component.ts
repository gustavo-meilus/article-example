import { Locator, Page } from '@playwright/test';
import { DonutChartBase } from '../../common/components/donut-chart.base';
import {
    Locators,
    locators,
    OnLoadLocators,
    onLoadLocators,
} from './stats-chart.locators';

export class StatsChartComponent extends DonutChartBase {
    readonly onLoadLocators: OnLoadLocators;
    readonly locators: Locators;
    readonly container: Locator;

    constructor(page: Page) {
        super(page);
        this.container = page.getByRole('region', { name: 'Statistics Chart' });
        this.locators = locators(this.container);
        this.onLoadLocators = onLoadLocators(this.container);
    }
}
