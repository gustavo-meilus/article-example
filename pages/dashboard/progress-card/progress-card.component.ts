import { Locator, Page } from '@playwright/test';
import { ComponentBase } from '../../common/base/component.base';
import { locators, onLoadLocators } from './progress-card.locators';

export class ProgressCardComponent extends ComponentBase {
    readonly url = './vue-element-admin/#';
    readonly onLoadLocators: Record<string, Locator>;
    readonly locators: Record<string, Locator>;
    readonly container: Locator;

    constructor(page: Page) {
        super(page);
        this.container = page.getByRole('region', { name: 'Progress Card' });
        this.locators = locators(this.container);
        this.onLoadLocators = onLoadLocators(this.container);
    }
}
