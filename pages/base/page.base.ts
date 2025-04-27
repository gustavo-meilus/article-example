import { Locator, Page } from '@playwright/test';
import { IComponentBase } from '../common/base/component.base';

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

/**
 * Base class for page objects in Playwright tests.
 * Provides common functionality for page navigation and element visibility checks.
 */
export abstract class PageBase implements IPageBase {
    readonly page: Page;
    abstract readonly url: string;
    abstract readonly onLoadLocators: Record<string, Locator>;
    abstract readonly locators: Record<string, Locator>;
    private dynamicPath: string = '';

    /**
     * Creates a new PageBase instance.
     * @param page - Playwright Page object
     */
    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Override this method to provide the components that contain locators to be merged
     * @returns Array of components that implement IComponentBase
     */
    protected getComponents(): IComponentBase[] {
        return [];
    }

    /**
     * Merges locators from base locators and all components
     * @param baseLocators - The base locators to merge with component locators
     * @returns Merged locators object
     */
    protected mergeLocators(
        baseLocators: Record<string, Locator>,
    ): Record<string, Locator> {
        return this.getComponents().reduce(
            (acc, component) => ({ ...acc, ...component.locators }),
            baseLocators,
        );
    }

    /**
     * Merges onLoadLocators from base locators and all components
     * @param baseLocators - The base onLoadLocators to merge with component onLoadLocators
     * @returns Merged onLoadLocators object
     */
    protected mergeOnLoadLocators(
        baseLocators: Record<string, Locator>,
    ): Record<string, Locator> {
        return this.getComponents().reduce(
            (acc, component) => ({ ...acc, ...component.onLoadLocators }),
            baseLocators,
        );
    }

    /**
     * Sets a dynamic path segment for the URL.
     * @param path - Path segment to append to the base URL
     */
    protected setDynamicPath(path: string): void {
        this.dynamicPath = path;
    }

    /**
     * Gets the complete URL including any dynamic path segments.
     * @returns Full URL string
     */
    protected getFullUrl(): string {
        return this.dynamicPath ? `${this.url}/${this.dynamicPath}` : this.url;
    }

    /**
     * Navigate to the page
     */
    async goto(): Promise<void>;
    /**
     * Navigate to the page with option to wait for loading locators
     * @param checkVisibility - Whether to wait for loading locators
     */
    async goto(checkVisibility: boolean): Promise<void>;
    /**
     * Navigate to the page with a specific ID
     * @param id - The ID to append to the URL
     * @param checkVisibility - Whether to wait for loading locators
     */
    async goto(id: string, checkVisibility?: boolean): Promise<void>;
    /**
     * Navigate to the page with an ID and suffix
     * @param id - The ID to append to the URL
     * @param suffix - Additional path segment to append after the ID
     * @param checkVisibility - Whether to wait for loading locators
     */
    async goto(
        id: string,
        suffix: string,
        checkVisibility?: boolean,
    ): Promise<void>;
    async goto(
        idOrCheck?: string | boolean,
        suffixOrCheck?: string | boolean,
        check?: boolean,
    ): Promise<void> {
        const checkVisibility =
            typeof idOrCheck === 'boolean'
                ? idOrCheck
                : typeof suffixOrCheck === 'boolean'
                ? suffixOrCheck
                : check ?? false;

        const path =
            typeof idOrCheck === 'string'
                ? typeof suffixOrCheck === 'string'
                    ? `${idOrCheck}/${suffixOrCheck}`
                    : idOrCheck
                : '';

        if (path) {
            this.setDynamicPath(path);
        }

        await this.page.goto(this.getFullUrl());
        if (checkVisibility) {
            await this.waitLoadingLocators();
        }
    }

    /**
     * Verifies that all components defined with a underscore are visible.
     * @param timeout - Maximum time to wait for elements to be visible (defaults to 10000ms)
     */
    async waitLoadingLocators(timeout = 10000): Promise<void> {
        const promises = Object.keys(this.onLoadLocators).map((key) =>
            this.onLoadLocators[
                key as keyof typeof this.onLoadLocators
            ].waitFor({
                state: 'visible',
                timeout,
            }),
        );
        await Promise.all(promises);
    }
}
