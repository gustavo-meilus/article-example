# Page Object Model (POM) Creation Rules

This document defines the standards and patterns for creating Page Object Models (POMs) in this Playwright testing architecture. The architecture follows a hierarchical, component-based approach with separated locators for maximum maintainability and scalability.

## Core Architecture Concepts

### 1. Hierarchical Page Objects

-   All page objects extend `PageBase` class and implement `IPageBase` interface
-   Common functionality is inherited from the base class
-   Domain-specific logic is implemented in individual page classes

### 2. Separated Locators Pattern

-   Locators are defined in separate `.locators.ts` files
-   Two types of locators: `onLoadLocators` (for page load verification) and `locators` (all locators including dynamic ones)
-   Locators are functions that receive either a `Page` or `Locator` (container) parameter

### 3. Component-Based Architecture

-   Complex pages are broken down into reusable components
-   Components extend from base classes (ComponentBase or specific base like ListBase, TableBase, etc.)
-   Components have their own locators scoped to a container element

### 4. Page Manager Pattern

-   Centralized page object instantiation through `pageManager` function in `pages/index.ts`
-   All page objects are accessed through the page manager in tests

## File Structure

### Pages

-   **Location**: `pages/{domain}/{domain}.page.ts`
-   **Locators**: `pages/{domain}/{domain}.locators.ts`
-   **Example**: `pages/login/login.page.ts`, `pages/login/login.locators.ts`

### Components

-   **Attached Components** (belong to specific pages):

    -   Location: `pages/{domain}/{component-name}/{component-name}.component.ts`
    -   Locators: `pages/{domain}/{component-name}/{component-name}.locators.ts`
    -   Example: `pages/dashboard/todo-list/todo-list.component.ts`

-   **Common Components** (used across multiple pages):
    -   Location: `pages/common/{component-name}/{component-name}.component.ts`
    -   Locators: `pages/common/{component-name}/{component-name}.locators.ts`
    -   Example: `pages/common/header-menu/header-menu.component.ts`

### Base Classes

-   **Page Base**: `pages/base/page.base.ts`
-   **Component Base**: `pages/common/base/component.base.ts`
-   **Specific Bases**: `pages/common/base/{type}.base.ts` (e.g., `table.base.ts`, `list.base.ts`)

## Implementation Rules

### 1. Page Class Structure

Every page must:

-   Extend `PageBase`
-   Define `url`, `onLoadLocators`, and `locators` as readonly properties
-   Import locators from a separate file
-   Implement domain-specific methods

```typescript
import { Page, Locator } from '@playwright/test';
import { PageBase } from '../base/page.base';
import { locators, onLoadLocators } from './login.locators';

export class LoginPage extends PageBase {
    readonly url = './vue-element-admin/#/login';
    readonly onLoadLocators: Record<string, Locator>;
    readonly locators: Record<string, Locator>;

    constructor(page: Page) {
        super(page);
        this.locators = locators(page);
        this.onLoadLocators = onLoadLocators(page);
    }

    // Domain-specific methods
    async executeLogin(username: string, password: string) {
        await this.locators.usernameTextbox.fill(username);
        await this.locators.passwordTextbox.fill(password);
        await this.locators.loginButton.click();
    }
}
```

### 2. Locator File Structure

Locator files must export two functions:

-   `onLoadLocators`: Elements that must be visible when the page loads
-   `locators`: All locators including dynamic ones (spread onLoadLocators)

```typescript
import { Page } from '@playwright/test';

export const onLoadLocators = (page: Page) => ({
    usernameTextbox: page.getByRole('textbox', { name: 'Username' }),
    passwordTextbox: page.getByRole('textbox', { name: 'Password' }),
    loginButton: page.getByRole('button', { name: 'Login' }),
});

export const locators = (page: Page) => ({
    ...onLoadLocators(page),
    errorMessage: page.getByRole('alert'),
    forgotPasswordLink: page.getByRole('link', { name: 'Forgot password?' }),
});
```

### 3. Component Implementation

Components must:

-   Extend appropriate base class (ComponentBase or specific base)
-   Define a `container` locator that scopes the component
-   Pass the container to locator functions

```typescript
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
```

### 4. Component Locators

Component locators receive a container instead of page:

```typescript
import { Locator } from '@playwright/test';

export const onLoadLocators = (container: Locator) => ({
    itemCheckbox: container.getByRole('checkbox'),
    itemText: container.getByRole('listitem'),
});

export const locators = (container: Locator) => ({
    ...onLoadLocators(container),
    deleteButton: container.getByRole('button', { name: 'Delete' }),
});
```

### 5. Pages with Attached Components

Pages with components must:

-   Initialize components in constructor
-   Override `attachedComponents()` method
-   Merge locators using `mergeLocators()` and `mergeOnLoadLocators()`

```typescript
export class DashboardPage extends PageBase {
    readonly url = './vue-element-admin/#/dashboard';
    readonly onLoadLocators: Record<string, Locator>;
    readonly locators: Record<string, Locator>;

    // Components
    readonly todoList: TodoListComponent;
    readonly statsChart: StatsChartComponent;

    constructor(page: Page) {
        super(page);

        // Initialize components
        this.todoList = new TodoListComponent(page);
        this.statsChart = new StatsChartComponent(page);

        // Merge all locators
        this.locators = this.mergeLocators(locators(page));
        this.onLoadLocators = this.mergeOnLoadLocators(onLoadLocators(page));
    }

    protected attachedComponents(): IComponentBase[] {
        return [this.todoList, this.statsChart];
    }
}
```

### 6. Page Manager Registration

Add all pages to the page manager:

```typescript
// pages/index.ts
import { BrowserContext, Page } from '@playwright/test';
import { DashboardPage } from './dashboard/dashboard.page';
import { LoginPage } from './login/login.page';
import { HeaderMenuPage } from './common/header-menu/header-menu.component';

export const pageManager = (page: Page, context: BrowserContext) => ({
    page,
    context,
    login: new LoginPage(page),
    dashboard: new DashboardPage(page),
    headerMenu: new HeaderMenuPage(page), // Common component
});
```

### 7. Locator Strategy (Priority Order)

Use Playwright's recommended locator strategies:

1. `getByRole()` - accessibility roles
2. `getByText()` - visible text
3. `getByLabel()` - form labels
4. `getByPlaceholder()` - input placeholders
5. `getByAltText()` - image alt text
6. `getByTitle()` - title attributes
7. `getByTestId()` - data-testid attributes
8. CSS/ID selectors - only when necessary

### 8. Method Guidelines

-   **Async methods**: All interaction methods should be async
-   **Return values**: Methods should return data, not make assertions
-   **Business logic**: Implement high-level business operations
-   **No test logic**: Keep test assertions in test files
-   **Clear naming**: Use descriptive method names that reflect business operations

## Complete Examples

### Simple Page Example

**File:** `pages/login/login.page.ts`

```typescript
import { Page, Locator } from '@playwright/test';
import { PageBase } from '../base/page.base';
import { locators, onLoadLocators } from './login.locators';

export class LoginPage extends PageBase {
    readonly url = './vue-element-admin/#/login';
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

    async getErrorMessage(): Promise<string | null> {
        const isVisible = await this.locators.errorMessage.isVisible();
        return isVisible
            ? await this.locators.errorMessage.textContent()
            : null;
    }
}
```

**File:** `pages/login/login.locators.ts`

```typescript
import { Page } from '@playwright/test';

export const onLoadLocators = (page: Page) => ({
    usernameTextbox: page.getByRole('textbox', { name: 'Username' }),
    passwordTextbox: page.getByRole('textbox', { name: 'Password' }),
    loginButton: page.getByRole('button', { name: 'Login' }),
});

export const locators = (page: Page) => ({
    ...onLoadLocators(page),
    errorMessage: page.getByRole('alert'),
    forgotPasswordLink: page.getByRole('link', { name: 'Forgot password?' }),
});
```

### Page with Components Example

**File:** `pages/dashboard/dashboard.page.ts`

```typescript
import { Locator, Page } from '@playwright/test';
import { PageBase } from '../base/page.base';
import { IComponentBase } from '../common/base/component.base';
import { locators, onLoadLocators } from './dashboard.locators';
import { TodoListComponent } from './todo-list/todo-list.component';
import { StatsChartComponent } from './stats-chart/stats-chart.component';

export class DashboardPage extends PageBase {
    readonly url = './vue-element-admin/#/dashboard';
    readonly onLoadLocators: Record<string, Locator>;
    readonly locators: Record<string, Locator>;

    // Components
    readonly todoList: TodoListComponent;
    readonly statsChart: StatsChartComponent;

    constructor(page: Page) {
        super(page);

        // Initialize components
        this.todoList = new TodoListComponent(page);
        this.statsChart = new StatsChartComponent(page);

        // Merge all locators
        this.locators = this.mergeLocators(locators(page));
        this.onLoadLocators = this.mergeOnLoadLocators(onLoadLocators(page));
    }

    protected attachedComponents(): IComponentBase[] {
        return [this.todoList, this.statsChart];
    }

    async getDashboardTitle(): Promise<string | null> {
        return await this.locators.pageTitle.textContent();
    }
}
```

### Component Example

**File:** `pages/dashboard/todo-list/todo-list.component.ts`

```typescript
import { Locator, Page } from '@playwright/test';
import { ListBase } from '../../common/base/list.base';
import { locators, onLoadLocators } from './todo-list.locators';

export class TodoListComponent extends ListBase {
    readonly onLoadLocators: Record<string, Locator>;
    readonly locators: Record<string, Locator>;
    readonly container: Locator;

    constructor(page: Page) {
        super(page);
        this.container = page.getByRole('region', { name: 'Todo List' });
        this.locators = locators(this.container);
        this.onLoadLocators = onLoadLocators(this.container);
    }

    async addTodo(text: string): Promise<void> {
        await this.locators.newTodoInput.fill(text);
        await this.locators.addButton.click();
    }

    async getTodoCount(): Promise<number> {
        return await this.locators.todoItems.count();
    }
}
```

**File:** `pages/dashboard/todo-list/todo-list.locators.ts`

```typescript
import { Locator } from '@playwright/test';

export const onLoadLocators = (container: Locator) => ({
    todoItems: container.getByRole('listitem'),
    newTodoInput: container.getByPlaceholder('Add a new todo'),
});

export const locators = (container: Locator) => ({
    ...onLoadLocators(container),
    addButton: container.getByRole('button', { name: 'Add' }),
    clearCompletedButton: container.getByRole('button', {
        name: 'Clear completed',
    }),
});
```

## Instructions for AI/Language Models

When generating POMs based on these rules:

1. **Always follow the architecture**: Extend correct base classes, separate locators, implement required properties
2. **Use the locator pattern**: Create separate .locators.ts files with onLoadLocators and locators functions
3. **Component scoping**: Always use container-scoped locators for components
4. **Merge locators**: For pages with components, always merge locators in constructor
5. **Follow naming conventions**: Use consistent file and class naming patterns
6. **Add to page manager**: Remember to add new pages to the pageManager in pages/index.ts
7. **Use proper locator strategies**: Follow the priority order for locator selection
8. **Document with TODO**: When information is missing, add TODO comments:
    ```typescript
    // TODO: Update locator when exact button text is known
    loginButton: page.getByRole('button'), // TODO: Add specific name
    ```
