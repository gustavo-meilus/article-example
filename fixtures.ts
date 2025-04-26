import { test as base, Page } from '@playwright/test';
import { pageManager, PageManager } from './pages';
import * as path from 'path';

// Declare the types of your fixtures.
type Fixtures = {
    app: PageManager;
};

export const test = base.extend<Fixtures>({
    app: async ({ page, context }, use) => {
        const manager = pageManager(page, context);
        await use(manager);
    },
});

export const tags = (filePath: string) => {
    const tags: string[] = [];
    // Normalize the path to use the correct separator for the current platform
    const normalizedPath = path.normalize(filePath);
    // Split the normalized path into parts, using the separator for the current platform
    const parts = normalizedPath.split(path.sep);

    const pathParts = parts.filter((part) => part !== ''); // Filter out any empty strings (if any)
    const folders = pathParts.slice(
        pathParts.indexOf('tests') + 1,
        pathParts.length - 1,
    );
    const fileName = pathParts[pathParts.length - 1];

    // Add tags based on folder and file names
    if (folders) {
        folders.forEach((part) => {
            tags.push(`@${part}`);
        });
    }
    if (fileName) {
        const nameOnly = fileName
            .replace('.ts', '')
            .replace('.test', '')
            .replace('.setup', '')
            .replace('.spec', '');
        const parts = nameOnly.split('.');
        parts.forEach((part) => {
            tags.push(`@${part}`);
        });
    }
    return [...new Set(tags)];
};

export { expect } from '@playwright/test';
