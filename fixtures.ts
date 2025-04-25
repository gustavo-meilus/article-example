import { test as base, Page } from '@playwright/test';
import { pageManager, PageManager } from './pages';

// Declare the types of your fixtures.
type Fixtures = {
    app: PageManager;
};

export const test = base.extend<Fixtures>({
    app: async ({ page }, use) => {
        const manager = pageManager(page);
        await use(manager);
    },
});

export { expect } from '@playwright/test';
