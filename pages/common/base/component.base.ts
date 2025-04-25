import { Locator, Page } from '@playwright/test';
import { PageBase } from '../../base/page.base';

/**
 * Interface defining the contract for component base operations.
 */
export interface IComponentBase {
    readonly page: Page;
    readonly container: Locator;
    readonly onLoadLocators: Record<string, Locator>;
    readonly locators: Record<string, Locator>;

    waitLoadingLocators(timeout?: number): Promise<void>;
}

export abstract class ComponentBase extends PageBase implements IComponentBase {
    abstract readonly url: string;
    abstract readonly onLoadLocators: Record<string, Locator>;
    abstract readonly locators: Record<string, Locator>;
    abstract readonly container: Locator;

    constructor(page: Page) {
        super(page);
    }
}
