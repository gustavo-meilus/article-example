import { Locator, Page } from '@playwright/test';
import { ComponentBase } from '../base/component.base';
import { locators, onLoadLocators } from './left-menu.locators';

export class LeftMenuPage extends ComponentBase {
    readonly url = './vue-element-admin/#';
    readonly onLoadLocators: Record<string, Locator>;
    readonly locators: Record<string, Locator>;
    readonly container: Locator;

    constructor(page: Page) {
        super(page);
        this.container = this.page.locator('.sidebar-container');
        this.locators = locators(this.container);
        this.onLoadLocators = onLoadLocators(this.container);
    }
}
