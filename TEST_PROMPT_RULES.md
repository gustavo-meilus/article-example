# Test Creation Rules for Playwright Architecture

## Core Concepts

This testing framework implements:

-   **Page Manager Pattern**: Centralized page object access through `app` fixture
-   **Dynamic Tagging System**: Automatic tag generation from file paths
-   **Component-Based Architecture**: Reusable UI components
-   **Hierarchical Page Objects**: Inheritance-based page structure

## File Naming & Location

### Test File Structure

```
tests/
├── {domain}/
│   ├── smoke/
│   │   └── {feature}.test.ts
│   ├── integration/
│   │   └── {feature}.test.ts
│   └── end-to-end/
│       └── {feature}.test.ts
└── common/
    └── {shared-feature}.test.ts
```

### Naming Convention

-   **Domain tests**: `./tests/{domain}/{test-type}/{feature}.test.ts`
-   **Component tests**: `./tests/{component}/{test-type}/{feature}.test.ts`
-   **Common tests**: `./tests/common/{feature}.test.ts`

## Required Test Structure

```typescript
import { test, expect, tags } from '../../fixtures';

test.describe(
    '{Feature/Component} - {Test Scenario}',
    { tag: tags(__filename) },
    () => {
        // Authentication setup (if needed)
        test.use({ storageState: '.auth/admin.json' });

        // Execution mode (default: parallel)
        // test.describe.configure({ mode: 'serial' }); // Only if tests depend on each other

        test('{specific test description}', async ({ app }) => {
            // Use app fixture to access page objects
            await app.login.goto();
            await app.login.executeLogin('user', 'pass');

            // Access common components
            await app.headerMenu.locators.accountButton.click();

            // Access page-specific components
            await app.dashboard.todoList.addTodo('New task');

            // Assertions
            expect(await app.dashboard.getTitle()).toBe('Dashboard');
        });
    },
);
```

## Using the Page Manager (app fixture)

The `app` fixture provides access to all page objects and components:

```typescript
test('navigate between pages', async ({ app }) => {
    // Access page objects
    await app.login.goto();
    await app.dashboard.goto();

    // Access common components
    await app.leftMenu.navigateTo('Users');
    await app.headerMenu.logout();

    // Access page-specific components
    const todoCount = await app.dashboard.todoList.getTodoCount();

    // Direct page access for Playwright methods
    await app.page.waitForURL('**/dashboard');
    await app.context.clearCookies();
});
```

## Dynamic Tagging System

### Automatic Tags

The `tags(__filename)` function automatically generates tags from:

-   **Folder structure**: `/tests/login/smoke/` → `@login`, `@smoke`
-   **File name**: `auth.login.test.ts` → `@auth`, `@login`

### Tag Usage Examples

```typescript
// Automatic tags only
test.describe(
    'Login functionality',
    { tag: tags(__filename) }, // Generates tags from file path
    () => {
        /* tests */
    },
);

// Combine automatic and manual tags
test.describe(
    'Critical user flow',
    { tag: [...tags(__filename), '@critical', '@regression'] },
    () => {
        /* tests */
    },
);
```

### Running Tests by Tags

```bash
# Run all login tests
npx playwright test --grep "@login"

# Run smoke tests
npx playwright test --grep "@smoke"

# Run critical regression tests
npx playwright test --grep "@critical.*@regression"
```

## Component Testing Patterns

### Testing Common Components

```typescript
test('header menu navigation', async ({ app }) => {
    await app.dashboard.goto();

    // Test common component functionality
    await app.headerMenu.locators.hamburgerContainer.click();
    await expect(app.leftMenu.container).toBeVisible();

    await app.headerMenu.locators.accountButton.click();
    await expect(app.headerMenu.locators.accountDropdown).toBeVisible();
});
```

### Testing Page-Specific Components

```typescript
test('dashboard widgets interaction', async ({ app }) => {
    await app.dashboard.goto();

    // Wait for page to load
    await app.dashboard.waitLoadingLocators();

    // Interact with attached components
    await app.dashboard.todoList.addTodo('New task');
    const stats = await app.dashboard.statsChart.getStats();

    // Component-specific assertions
    expect(await app.dashboard.todoList.getTodoCount()).toBe(5);
});
```

## Best Practices

### 1. Use Business-Level Methods

```typescript
// ❌ Don't access locators directly for complex operations
await app.login.locators.usernameTextbox.fill('user');
await app.login.locators.passwordTextbox.fill('pass');
await app.login.locators.loginButton.click();

// ✅ Use page object methods
await app.login.executeLogin('user', 'pass');
```

### 2. Leverage Page Loading Verification

```typescript
// ✅ Use built-in loading verification
await app.dashboard.goto(true); // Waits for onLoadLocators

// Or explicitly wait
await app.dashboard.goto();
await app.dashboard.waitLoadingLocators();
```

### 3. Component Container Scoping

```typescript
test('interact with specific component', async ({ app }) => {
    await app.dashboard.goto();

    // Components are scoped to their containers
    const todoItems = await app.dashboard.todoList.locators.todoItems.count();

    // This won't interfere with other lists on the page
    await app.dashboard.todoList.locators.deleteButton.first().click();
});
```

### 4. Proper Test Organization

```typescript
test.describe('Feature Group', { tag: tags(__filename) }, () => {
    // Group related tests
    test.describe('Subfeature', () => {
        test('specific scenario 1', async ({ app }) => {
            // Test implementation
        });

        test('specific scenario 2', async ({ app }) => {
            // Test implementation
        });
    });
});
```

## Authentication Patterns

### Setup Authentication

```typescript
// tests/auth.setup.ts
import { test as setup } from '../fixtures';

setup('authenticate as admin', async ({ app }) => {
    await app.login.goto();
    await app.login.executeLogin(
        process.env.ADMIN_USER!,
        process.env.ADMIN_PASS!,
    );
    await app.page.context().storageState({ path: '.auth/admin.json' });
});
```

### Use Authentication in Tests

```typescript
test.describe('Admin features', { tag: tags(__filename) }, () => {
    test.use({ storageState: '.auth/admin.json' });

    test('access admin dashboard', async ({ app }) => {
        await app.dashboard.goto();
        // Already authenticated
    });
});
```

## Error Handling Patterns

```typescript
test('handle errors gracefully', async ({ app }) => {
    // Check element existence before interaction
    if (await app.dashboard.locators.warningBanner.isVisible()) {
        await app.dashboard.dismissWarning();
    }

    // Use page object methods that handle errors
    const errorMessage = await app.login.getErrorMessage();
    if (errorMessage) {
        expect(errorMessage).toContain('Invalid credentials');
    }
});
```

## Parallel vs Serial Execution

```typescript
// Default: Parallel execution
test.describe('Independent tests', { tag: tags(__filename) }, () => {
    // Each test runs independently
});

// Serial execution for dependent tests
test.describe('Dependent workflow', { tag: tags(__filename) }, () => {
    test.describe.configure({ mode: 'serial' });

    let orderId: string;

    test('create order', async ({ app }) => {
        orderId = await app.orders.createOrder();
    });

    test('process order', async ({ app }) => {
        await app.orders.processOrder(orderId);
    });
});
```

## Key Rules Summary

1. **Always use the `app` fixture** to access page objects and components
2. **Apply `tags(__filename)`** to every test.describe for automatic tagging
3. **Use business-level methods** from page objects instead of raw locators
4. **Leverage component architecture** for complex UI interactions
5. **Follow domain-based organization** for test files
6. **Specify authentication** when needed using storageState
7. **Default to parallel execution** unless tests are dependent
8. **Wait for page loading** using built-in verification methods
9. **Group related tests** using nested describe blocks
10. **Keep assertions in tests**, not in page objects
