import { Locator, Page } from '@playwright/test';
import { IComponentBase } from './component.base';

export abstract class TableBase implements IComponentBase {
    readonly page: Page;
    abstract readonly container: Locator;
    abstract readonly onLoadLocators: Record<string, Locator>;
    abstract readonly locators: Record<string, Locator>;

    constructor(page: Page) {
        this.page = page;
    }

    async waitLoadingLocators(timeout = 10000): Promise<void> {
        const promises = Object.keys(this.onLoadLocators).map((key) =>
            this.onLoadLocators[key].waitFor({ state: 'visible', timeout }),
        );
        await Promise.all(promises);
    }
}
