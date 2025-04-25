import { Locator } from '@playwright/test';

export const onLoadLocators = (container: Locator) => ({
    // Note: Parent locators are not included since we're now scoped to the todo list container
    // Todo list elements
    todoInput: container.getByRole('textbox', { name: 'Todo List' }),
    todoList: container,
    todoItems: container.getByRole('listitem'),
});

export const locators = (container: Locator) => ({
    ...onLoadLocators(container),
    // Additional dynamic locators
    todoCheckboxes: container.getByRole('checkbox'),
    todoCompletedItems: container.getByRole('checkbox', { checked: true }),
    todoActiveItems: container.getByRole('checkbox', { checked: false }),
});

export type OnLoadLocators = ReturnType<typeof onLoadLocators>;
export type Locators = ReturnType<typeof locators>;
