import { Page } from '@playwright/test';

export const onLoadLocators = (page: Page) => ({
    // Stats cards
    newVisitsCard: page.getByText('New Visits').first(),
    messagesCard: page.getByText('Messages').first(),
    purchasesCard: page.getByText('Purchases').first(),
    shoppingsCard: page.getByText('Shoppings').first(),

    // Github link
    githubLink: page.getByRole('link', { name: 'View source on Github' }),

    // Order table
    orderTable: page.getByRole('table').first(),
    orderTableHeaders: page.getByRole('row').first(),

    // Todo list section
    todoInput: page.getByRole('textbox', { name: 'Todo List' }),
    todoList: page.getByRole('list').first(),
    todoItems: page.getByRole('listitem'),

    // Progress section
    progressSection: page.getByText('Vue').first().locator('..').locator('..'),
    vueProgress: page.getByText('Vue').first(),
    javascriptProgress: page.getByText('JavaScript').first(),
    cssProgress: page.getByText('CSS').first(),
    eslintProgress: page.getByText('ESLint').first(),
});

export const locators = (page: Page) => ({
    ...onLoadLocators(page),
    // Additional locators for dynamic elements
    orderRows: page
        .getByRole('row')
        .filter({ hasNotText: 'Order_No Price Status' }),
    todoCheckboxes: page.getByRole('checkbox'),
    todoCompletedItems: page.getByRole('checkbox', { checked: true }),
    todoActiveItems: page.getByRole('checkbox', { checked: false }),
    progressBars: page.getByRole('progressbar'),
});

export type OnLoadLocators = ReturnType<typeof onLoadLocators>;
export type Locators = ReturnType<typeof locators>;
