import { Locator, Page } from '@playwright/test';
import { ListBase } from '../../common/base/list.base';
import { locators, onLoadLocators } from './todo-list.locators';

export class TodoListComponent extends ListBase {
    readonly onLoadLocators: Record<string, Locator>;
    readonly locators: Record<string, Locator>;
    readonly container: Locator;

    constructor(page: Page) {
        super(page);
        this.container = page.getByRole('list').first();
        this.locators = locators(this.container);
        this.onLoadLocators = onLoadLocators(this.container);
    }
}
