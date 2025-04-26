import { Locator, Page } from '@playwright/test';
import { ComponentBase } from '../base/component.base';
import { locators, onLoadLocators } from './header-menu.locators';

export class HeaderMenuPage extends ComponentBase {
    readonly url = './vue-element-admin/#';
    readonly onLoadLocators: Record<string, Locator>;
    readonly locators: Record<string, Locator>;
    readonly container: Locator;

    constructor(page: Page) {
        super(page);
        this.container = this.page.locator('.navbar');
        this.locators = locators(this.container);
        this.onLoadLocators = onLoadLocators(this.container);
    }
}
