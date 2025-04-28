# Automation with Playwright: Building a Scalable Testing Architecture

In today's digital landscape, web applications must deliver flawless experiences across an expanding array of browsers, devices, and platforms. This increasing complexity creates significant challenges for testing teams who must ensure consistent functionality and user experience. Playwright has emerged as a powerful solution for testing in these complex scenarios, offering cross-browser compatibility and powerful automation capabilities that fits a wide range of solutions.

However, even with Playwright's robust feature set, many testing projects fail to achieve their full potential due to architectural shortcomings. Without a carefully designed structure, test suites quickly become unwieldy, difficult to maintain, and prone to failures that undermine their reliability. The true challenge lies not in individual test creation but in constructing a cohesive, maintainable testing ecosystem.

This comprehensive guide will transform your Playwright implementation from basic test scripts into a sophisticated framework that scales with your application. We'll focus on proven architectural patterns that promote code reusability, clear organization, and sustainable growth. By following these battle-tested approaches, you'll create a testing foundation that remains robust even as your application and team expand, ultimately improving both product quality and development velocity.

## Setting Up Your Project Foundation

A well-structured Playwright project begins with thoughtful configuration. This section explores the essential elements that form the bedrock of a scalable testing architecture, focusing on settings that enhance test reliability, execution speed, and maintainability.

### Optimizing Your Playwright Configuration

The `playwright.config.ts` file defines your testing framework's behavior. Key configuration options include:

1. **Environment Management**: Separate configuration from code for cleaner management.

```typescript
import dotenv from 'dotenv';
import path from 'path';

// Read from ".env" file.
dotenv.config({ path: path.resolve(__dirname, '.env') });
```

2. **Parallel Execution**: Slash execution time for large test suites.

```typescript
/* Run tests in files in parallel */
fullyParallel: true,
```

3. **Multi-Format Reporting**: Get test results in formats suited to different needs.

```typescript
/* Reporter to use */
reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'playwright-report/results.json' }],
],
```

4. **Environment Portability**: Use relative paths for cross-environment compatibility.

```typescript
use: {
    /* Base URL for navigation actions */
    baseURL: process.env.BASE_URL,
}
```

5. **Authentication Management**: Reuse authentication state across tests.

```typescript
/* Configure projects */
projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
        name: 'chromium',
        use: {
            ...devices['Desktop Chrome'],
            storageState: '.auth/user.json',
        },
        dependencies: ['setup'],
    },
],
```

Here's the complete configuration:

```typescript
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Read from ".env" file.
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
    testDir: './tests',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
        ['html'],
        ['list'],
        ['json', { outputFile: 'playwright-report/results.json' }],
    ],
    /* Shared settings for all the projects below. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: process.env.BASE_URL,

        /* Collect trace when retrying the failed test. */
        trace: 'on-first-retry',
    },

    /* Configure projects */
    projects: [
        { name: 'setup', testMatch: /.*\.setup\.ts/ },

        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                // Use prepared auth state.
                storageState: '.auth/user.json',
            },
            dependencies: ['setup'],
        },
    ],
});
```

This configuration ensures test isolation, reproducibility, and clear reporting, establishing the foundation upon which the rest of your testing architecture will build. By taking time to configure these settings properly, you'll avoid common pitfalls that plague many testing projects and set your team up for long-term success.

## Structuring Your Project Folders

As test suites grow, disorganized file structures quickly become unmanageable. This section introduces a domain-based organization pattern that scales naturally with your application, keeping related code together while maintaining clear boundaries between different functional areas.

### Organizing for Clarity and Scale

A well-organized folder structure maintains clarity as your test suite grows. Consider this domain-based organization:

```
├── pages/
│   ├── base/
│   ├── common/
|   |   ├── base/
|   |   ├── header-menu/
|   |   ├── left-menu/
│   ├── dashboard/
│   └── login/
└── tests/
    ├── common/
    ├── dashboard/
        ├── end-to-end/
        ├── integration/
        └── smoke/
    ├── header-menu/
        ├── end-to-end/
        ├── integration/
        └── smoke/
    ├── left-menu/
        ├── end-to-end/
        ├── integration/
        └── smoke/
    └── login/
        ├── end-to-end/
        ├── integration/
        └── smoke/
```

This structure implements four key principles:

1. **Domain-Driven Organization**: Group related files by application domain for easy navigation
2. **Test Type Separation**: Divide tests by type (smoke, integration, end-to-end) for targeted execution
3. **Component-Based Structure**: Separate complex UI elements into discrete components for better reusability
4. **Clear Separation of Concerns**: Keep page objects, locators, and tests in separate files

This organization enables efficient test planning and execution based on domain and test type, while supporting the dynamic tagging system we'll explore later.

The value of thoughtful file organization becomes increasingly apparent as your project grows. This structure not only makes it easier for team members to locate relevant files but also naturally enforces architectural boundaries that promote code quality. With domains clearly separated, changes to one area have minimal impact on others, reducing the risk of unintended side effects when making updates.

## Creating Hierarchical Page Objects

The Page Object Model (POM) pattern is a cornerstone of maintainable test automation, but implementing it effectively for complex applications requires additional structure. This section introduces a hierarchical approach to page objects that balances flexibility with consistency through class inheritance and composition.

### Separating Locators from Page Logic

Decouple UI element selectors from page behavior for cleaner, more maintainable code:

```typescript
// login.locators.ts
import { Page } from '@playwright/test';

export const onLoadLocators = (page: Page) => ({
    usernameTextbox: page.getByRole('textbox', { name: 'Username' }),
    passwordTextbox: page.getByRole('textbox', { name: 'Password' }),
    loginButton: page.getByRole('button', { name: 'Login' }),
    languagesButton: page.getByRole('button').filter({ hasText: /^$/ }),
});

export const locators = (page: Page) => ({
    ...onLoadLocators(page),
    languageList: page.getByRole('list'),
});
```

Splitting locators into `onLoadLocators` and `locators` enables automatic loading verification during navigation.

This separation provides three key benefits:

1. **Focused Responsibility**: Locator files define selectors, page classes define behavior
2. **Targeted Maintenance**: Update locators in isolation when UI elements change
3. **Enhanced Reusability**: Share locators across different page objects as needed

### Building the Page Object Foundation

Start with a clear interface that defines the contract for all page objects:

```typescript
import { Locator, Page } from '@playwright/test';
import { IComponentBase } from '../common/base/component.base';

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
```

Then implement a base class that all page objects will extend:

```typescript
import { Locator, Page } from '@playwright/test';
import { IComponentBase } from '../common/base/component.base';

export abstract class PageBase implements IPageBase {
    readonly page: Page;
    abstract readonly url: string;
    abstract readonly onLoadLocators: Record<string, Locator>;
    abstract readonly locators: Record<string, Locator>;
    private dynamicPath: string = '';

    constructor(page: Page) {
        this.page = page;
    }

    protected getComponents(): IComponentBase[] {
        return [];
    }

    protected mergeLocators(
        baseLocators: Record<string, Locator>,
    ): Record<string, Locator> {
        return this.getComponents().reduce(
            (acc, component) => ({ ...acc, ...component.locators }),
            baseLocators,
        );
    }

    protected mergeOnLoadLocators(
        baseLocators: Record<string, Locator>,
    ): Record<string, Locator> {
        return this.getComponents().reduce(
            (acc, component) => ({ ...acc, ...component.onLoadLocators }),
            baseLocators,
        );
    }

    protected setDynamicPath(path: string): void {
        this.dynamicPath = path;
    }

    protected getFullUrl(): string {
        return this.dynamicPath ? `${this.url}/${this.dynamicPath}` : this.url;
    }

    // Multiple goto method signatures for flexibility
    async goto(): Promise<void>;
    async goto(checkVisibility: boolean): Promise<void>;
    async goto(id: string, checkVisibility?: boolean): Promise<void>;
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
```

This base class provides:

-   Common navigation methods
-   Component integration
-   Loading verification
-   Dynamic URL support

### Implementing Specific Page Objects

Page objects inherit from the base class and add domain-specific functionality:

```typescript
// login.page.ts
export class LoginPage extends PageBase {
    readonly url = './login';
    readonly onLoadLocators: Record<string, Locator>;
    readonly locators: Record<string, Locator>;

    constructor(page: Page) {
        super(page);
        this.locators = locators(page);
        this.onLoadLocators = onLoadLocators(page);
    }

    async executeLogin(username: string, password: string) {
        await this.locators.usernameTextbox.fill(username);
        await this.locators.passwordTextbox.fill(password);
        await this.locators.loginButton.click();
    }
}
```

This creates a clean inheritance hierarchy where:

-   Base class provides common functionality
-   Specific page objects implement domain logic
-   Business-focused methods handle page interactions

By implementing this hierarchical POM approach, you create a flexible yet consistent foundation for all your page interactions. The separation of concerns makes each class more focused and easier to understand, while the inheritance structure eliminates duplication and enforces consistency. This approach scales naturally as your application grows, allowing you to model even the most complex interfaces with maintainable code.

## Centralizing Page Management with Fixtures

Creating and managing page objects efficiently becomes challenging as test suites expand. This section introduces a centralized page management approach that simplifies test development through dependency injection, ensuring consistent object usage across your entire test suite.

### The Page Manager Pattern

Create a factory function that centralizes page object instantiation:

```typescript
// pages/index.ts
import { BrowserContext, Page } from '@playwright/test';
import { DashboardPage } from './dashboard/dashboard.page';
import { LoginPage } from './login/login.page';

export const pageManager = (page: Page, context: BrowserContext) => ({
    page,
    context,
    login: new LoginPage(page),
    dashboard: new DashboardPage(page),
});
```

### Test Fixtures for Dependency Injection

Use Playwright's test fixtures to inject the Page Manager into tests:

```typescript
// fixtures.ts
import { test as base, Page } from '@playwright/test';
import { pageManager } from './pages';

type Fixtures = {
    app: ReturnType<typeof pageManager>;
};

export const test = base.extend<Fixtures>({
    app: async ({ page, context }, use) => {
        const manager = pageManager(page, context);
        await use(manager);
    },
});

export { expect } from '@playwright/test';
```

This simplifies test code significantly:

```typescript
// login.spec.ts
test('check auth login', async ({ app }) => {
    await app.login.goto();
    await app.login.executeLogin(process.env.USER_NAME!, process.env.PASSWORD!);
    await app.page.waitForURL('./vue-element-admin/#/dashboard');
});
```

This approach delivers four key benefits:

1. **Streamlined Test Code**: No manual page object creation needed
2. **Consistent Object Usage**: All tests use the same page object instances
3. **Automatic Resource Management**: Playwright handles context lifecycle
4. **Type Safety**: TypeScript ensures correct usage of page objects

The page manager pattern is particularly valuable as your test suite grows and more developers join the project. By centralizing page object creation and providing a unified access point, you eliminate common errors and inconsistencies that arise when different tests instantiate objects differently. This centralized approach creates a more cohesive test suite with clearer patterns, making it easier for new team members to contribute effectively.

## Implementing Dynamic Test Tagging

Test organization becomes crucial as your suite grows. This section introduces a powerful automated tagging system that derives test tags from your folder structure, enabling flexible test selection without requiring manual tag maintenance.

### The Tags Function

Create a utility that extracts tags from file paths:

```typescript
// fixtures.ts
export const tags = (filePath: string) => {
    const tags: string[] = [];
    const normalizedPath = path.normalize(filePath);
    const parts = normalizedPath.split(path.sep);

    const pathParts = parts.filter((part) => part !== '');
    const folders = pathParts.slice(
        pathParts.indexOf('tests') + 1,
        pathParts.length - 1,
    );
    const fileName = pathParts[pathParts.length - 1];

    // Add tags from folder names
    if (folders) {
        folders.forEach((part) => {
            tags.push(`@${part}`);
        });
    }

    // Add tags from file name
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

    // Return unique tags
    return [...new Set(tags)];
};
```

### Applying Tags to Tests

Apply these tags to individual tests:

```typescript
// tests/login/smoke/login.spec.ts
test(
    'check login screen loading',
    {
        tag: tags(__filename),
    },
    async ({ app }) => {
        await app.login.goto();
        const promises = Object.entries(app.login.onLoadLocators).map(
            (element) => {
                return expect(element[1]).toBeVisible();
            },
        );
        await Promise.all(promises);
    },
);
```

For a test file at `tests/login/smoke/login.spec.ts`, this generates tags like `@login` and `@smoke`. Run specific test subsets with:

```bash
npx playwright test --grep "@login"
```

Dynamic tagging provides four significant advantages:

1. **Zero Manual Tagging**: Tags generate automatically from your folder structure
2. **Consistent Organization**: Tags follow a predictable pattern
3. **Flexible Test Selection**: Run tests by domain, type, or other criteria
4. **Self-Documenting Tests**: File paths reveal test purpose and scope

The real power of this approach emerges when your test suite contains hundreds or thousands of tests. Dynamic tagging enables you to select precise subsets of tests based on any combination of criteria, facilitating focused testing during development and comprehensive testing in CI/CD pipelines. Because the tags are derived from your folder structure, they remain up-to-date without additional maintenance, creating a self-documenting system that evolves naturally with your project.

## Managing Complex Pages with Component Objects

Modern web applications often contain intricate UI components that require dedicated abstractions. This section introduces a component-based architecture that breaks complex pages into manageable pieces, enabling reuse, parallel development, and simplified maintenance.

### Component Base Structure

Define an interface and base class for all components:

```typescript
// pages/common/base/component.base.ts
import { Locator, Page } from '@playwright/test';
import { PageBase } from '../../base/page.base';

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
```

This structure defines components with:

-   A reference to the page
-   A container element that scopes the component
-   Locators for UI elements
-   Loading verification methods

### Implementing Components

Create individual component classes with their own locators:

```typescript
// header-menu.component.ts
import { Locator, Page } from '@playwright/test';
import { ComponentBase } from '../base/component.base';
import { locators, onLoadLocators } from './header-menu.locators';

export class HeaderMenuPage extends ComponentBase {
    readonly url = './vue-element-admin/#';
    readonly onLoadLocators: Record<string, Locator>;
    readonly locators: Record<string, Locator>;
    readonly container: Locator;

    constructor(page: Page) {
        super(page);
        this.container = this.page.locator('.navbar');
        this.locators = locators(this.container);
        this.onLoadLocators = onLoadLocators(this.container);
    }
}
```

Component locators are scoped to their container:

```typescript
// header-menu.locators.ts
import { Locator } from '@playwright/test';

export const onLoadLocators = (container: Locator) => ({
    hamburgerContainer: container.locator('#hamburger-container'),
    breadcrumbNav: container.getByLabel('Breadcrumb'),
    rightMenu: container.locator('.right-menu'),
    searchButton: container.locator('#header-search'),
    screenFullButton: container.locator('#screenfull'),
    sizeSelectButton: container.locator('#size-select'),
    languageButton: container.locator('.international'),
    accountButton: container.locator('.avatar-container'),
});

export const locators = (container: Locator) => ({
    ...onLoadLocators(container),
    accountDropdown: container.locator('#dropdown-menu-193'),
});
```

### Common vs. Attached Components

Handle components in two ways:

1. **Common Components** (standalone in multiple pages):
   Add them directly to the Page Manager:

```typescript
// pages/index.ts
export const pageManager = (page: Page, context: BrowserContext) => ({
    page,
    context,
    login: new LoginPage(page),
    dashboard: new DashboardPage(page),
    leftMenu: new LeftMenuPage(page),
    headerMenu: new HeaderMenuPage(page),
});
```

2. **Attached Components** (belong to specific pages):
   Create component hierarchies with base classes:

```typescript
// pages/common/base/radar-chart.base.ts
export abstract class RadarChartBase implements IComponentBase {
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
```

Then implement specific components:

```typescript
// pages/dashboard/budget-chart/budget-chart.component.ts
export class BudgetChartComponent extends RadarChartBase {
    readonly onLoadLocators: Record<string, Locator>;
    readonly locators: Record<string, Locator>;
    readonly container: Locator;

    constructor(page: Page) {
        super(page);
        this.container = page.getByRole('region', { name: 'Budget Chart' });
        this.locators = locators(this.container);
        this.onLoadLocators = onLoadLocators(this.container);
    }
}
```

### Integrating Components with Pages

Compose complex pages from their components:

```typescript
// pages/dashboard/dashboard.page.ts
export class DashboardPage extends PageBase {
    readonly url = './vue-element-admin/#/dashboard';
    readonly onLoadLocators: Record<string, Locator>;
    readonly locators: Record<string, Locator>;

    // Components
    readonly statsChart: StatsChartComponent;
    readonly budgetChart: BudgetChartComponent;
    readonly areasChart: AreasChartComponent;
    readonly weekChart: WeekChartComponent;
    readonly orderTable: OrderTableComponent;
    readonly todoList: TodoListComponent;
    readonly progressCard: ProgressCardComponent;

    constructor(page: Page) {
        super(page);

        // Initialize components
        this.statsChart = new StatsChartComponent(page);
        this.budgetChart = new BudgetChartComponent(page);
        this.areasChart = new AreasChartComponent(page);
        this.weekChart = new WeekChartComponent(page);
        this.orderTable = new OrderTableComponent(page);
        this.todoList = new TodoListComponent(page);
        this.progressCard = new ProgressCardComponent(page);

        // Merge all locators
        this.locators = this.mergeLocators(locators(page));
        this.onLoadLocators = this.mergeOnLoadLocators(onLoadLocators(page));
    }

    protected getComponents(): IComponentBase[] {
        return [
            this.statsChart,
            this.budgetChart,
            this.areasChart,
            this.weekChart,
            this.orderTable,
            this.todoList,
            this.progressCard,
        ];
    }
}
```

The PageBase class merges component locators automatically:

```typescript
// pages/base/page.base.ts
protected getComponents(): IComponentBase[] {
    return [];
}

protected mergeLocators(
    baseLocators: Record<string, Locator>,
): Record<string, Locator> {
    return this.getComponents().reduce(
        (acc, component) => ({ ...acc, ...component.locators }),
        baseLocators,
    );
}

protected mergeOnLoadLocators(
    baseLocators: Record<string, Locator>,
): Record<string, Locator> {
    return this.getComponents().reduce(
        (acc, component) => ({ ...acc, ...component.onLoadLocators }),
        baseLocators,
    );
}
```

This component-based approach delivers four major benefits:

1. **Focused Responsibility**: Each component has a single clear purpose
2. **Maximized Reusability**: Components can be shared across pages
3. **Parallel Development**: Team members can work on different components simultaneously
4. **Isolated Maintenance**: Changes to components don't affect the rest of the page

Component-based architecture truly shines when dealing with complex web applications. By modeling your application as a composition of discrete components, you create a more accurate representation that mirrors the application's actual structure. This approach not only makes tests more maintainable but also promotes better understanding of the application itself, bridging the gap between development and testing. The resulting test code becomes more intuitive, easier to debug, and significantly more adaptable to UI changes.

## Conclusion

Building a sustainable testing architecture is an investment that pays dividends throughout your project's lifecycle. The comprehensive approach outlined in this article addresses the common pitfalls that traditionally plague test automation efforts and provides a robust foundation that evolves alongside your application.

By implementing this architecture, you create a testing framework with multiple layers of value:

1. **Technical Excellence**: The optimized configuration, hierarchical page objects, and component-based structure produce clean, maintainable code that follows software engineering best practices.

2. **Process Efficiency**: Centralized page management, dynamic tagging, and domain-driven organization dramatically reduce the time needed to create, run, and maintain tests, allowing your team to focus on delivering value rather than fighting fragile tests.

3. **Organizational Scalability**: As your team grows, the clear structure, consistent patterns, and logical organization make onboarding new team members faster and more effective, enabling your testing efforts to scale with your organization.

4. **Quality Assurance**: The resulting test suite provides reliable, comprehensive coverage that accurately detects regressions, giving your team confidence to release frequently and innovate rapidly.

The true measure of a testing architecture isn't how it performs on day one but how it supports your team's efforts months and years into development. This approach creates a testing ecosystem that remains valuable throughout your application's evolution, adapting to new requirements and technologies without requiring constant rewrites or maintenance overhead.

As Playwright continues to advance with new capabilities, this architectural foundation will integrate these innovations seamlessly, ensuring your testing strategy remains current without sacrificing stability or consistency. By adopting these patterns today, you're not just solving immediate testing challenges but creating a sustainable advantage that will benefit your project throughout its entire lifecycle.
