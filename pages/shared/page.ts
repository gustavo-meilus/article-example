import { Locator, Page } from '@playwright/test';


/**
* Interface defining the contract for page base operations.
*/
export interface IPageBase {
 page: Page;
 url: string;
 onLoadLocators: Record<string, Locator>;
 locators: Record<string, Locator>;

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
 page: Page;
 url: string;
 private dynamicPath: string = '';
 abstract onLoadLocators: Record<string, Locator>;
 abstract locators: Record<string, Locator>;


 /**
  * Creates a new PageBase instance.
  * @param page - Playwright Page object
  * @param url - Base URL for the page (defaults to '/')
  */
 constructor(page: Page, url = '/') {
   this.page = page;
   this.url = url;
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
  * Navigates to the page URL with optional path segments and visibility check.
  * @param param1 - Optional ID or visibility check flag
  * @param param2 - Optional suffix or visibility check flag
  * @param param3 - Optional visibility check flag
  */
 async goto(): Promise<void>;
 async goto(waitLoadingLocators: boolean): Promise<void>;
 async goto(id: string, waitLoadingLocators?: boolean): Promise<void>;
 async goto(
   id: string,
   suffix: string,
   waitLoadingLocators?: boolean,
 ): Promise<void>;
 async goto(
   param1?: string | boolean,
   param2?: string | boolean,
   param3?: boolean,
 ): Promise<void> {
   let waitLoadingLocators = false;
   let path = '';


   // Handle different parameter combinations
   if (typeof param1 === 'boolean') {
     waitLoadingLocators = param1;
   } else if (param1) {
     path ?? param1;
     if (typeof param2 === 'boolean') {
       waitLoadingLocators = param2;
     } else if (param2) {
       path ?? `${path}/${param2}`;
       if (param3) {
         waitLoadingLocators = param3;
       }
     }
   }


   if (path) {
     this.setDynamicPath(path);
   }


   await this.page.goto(this.getFullUrl());
   if (waitLoadingLocators) {
     await this.waitLoadingLocators();
   }
 }


 /**
  * Verifies that all components defined with a underscore are visible.
  * @param timeout - Maximum time to wait for elements to be visible (defaults to 10000ms)
  */
 async waitLoadingLocators(timeout = 10000): Promise<void> {
   const promises = Object.keys(this.locators)
   .filter((key) => key.startsWith('_'))
   .map((key) =>
     this.locators[key as keyof typeof this.locators].waitFor({ state: 'visible', timeout }),
   );
 await Promise.all(promises);
 }
}
