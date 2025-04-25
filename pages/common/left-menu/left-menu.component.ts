import { Locator, Page } from '@playwright/test';
import { ComponentBase } from '../base/component.base';
import {
    Locators,
    locators,
    OnLoadLocators,
    onLoadLocators,
} from './left-menu.locators';

export class LeftMenuPage extends ComponentBase {
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

    async getAllMenuItems() {
        const menuItems = await this.locators.menubar
            .getByRole('menuitem')
            .all();
        return menuItems;
    }
}
