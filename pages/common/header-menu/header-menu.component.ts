import { Locator, Page } from '@playwright/test';
import { ComponentBase } from '../components/component.base';
import {
    Locators,
    locators,
    OnLoadLocators,
    onLoadLocators,
} from './header-menu.locators';

export class HeaderMenuPage extends ComponentBase {
    readonly url = './vue-element-admin/#';
    readonly onLoadLocators: OnLoadLocators;
    readonly locators: Locators;
    readonly container: Locator;

    constructor(page: Page) {
        super(page);
        this.container = this.page.locator('.sidebar-container');
        this.locators = locators(this.container);
        this.onLoadLocators = onLoadLocators(this.container);
    }
}
