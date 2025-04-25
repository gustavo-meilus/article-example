import { Locator, Page } from '@playwright/test';
import { ListBase } from '../../common/components/list.base';
import {
    Locators,
    locators,
    OnLoadLocators,
    onLoadLocators,
} from './todo-list.locators';

export class TodoListComponent extends ListBase {
    readonly onLoadLocators: OnLoadLocators;
    readonly locators: Locators;
    readonly container: Locator;

    constructor(page: Page) {
        super(page);
        this.container = page.getByRole('list').first();
        this.locators = locators(this.container);
        this.onLoadLocators = onLoadLocators(this.container);
    }
}
