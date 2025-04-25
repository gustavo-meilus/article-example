import { Locator, Page } from '@playwright/test';

/**
 * Interface defining the contract for page base operations.
 */
export interface IPageBase {
    readonly page: Page;
    readonly url: string;
    readonly onLoadLocators: Record<string, Locator>;
    readonly locators: Record<string, Locator>;

    waitLoadingLocators(timeout?: number): Promise<void>;

    goto(): Promise<void>;
    goto(checkVisibility: boolean): Promise<void>;
    goto(id: string, checkVisibility?: boolean): Promise<void>;
    goto(id: string, suffix: string, checkVisibility?: boolean): Promise<void>;
}
