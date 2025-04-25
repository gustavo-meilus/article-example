import { Locator } from '@playwright/test';

export const onLoadLocators = (container: Locator) => ({
    dashboardLink: container.getByRole('link', { name: 'Dashboard' }),
    documentationLink: container.getByRole('link', { name: 'Documentation' }),
    guideLink: container.getByRole('link', { name: 'Guide' }),
    permissionMenu: container.getByRole('menuitem', { name: 'Permission' }),
    iconsLink: container.getByRole('link', { name: 'Icons' }),
    componentsMenu: container.getByRole('menuitem', { name: 'Components' }),
    chartsMenu: container.getByRole('menuitem', { name: 'Charts' }),
    nestedRoutesMenu: container.getByRole('menuitem', {
        name: 'Nested Routes',
    }),
    tableMenu: container.getByRole('menuitem', { name: 'Table' }),
    exampleMenu: container.getByRole('menuitem', { name: 'Example' }),
    tabLink: container.getByRole('link', { name: 'Tab' }),
    errorPagesMenu: container.getByRole('menuitem', { name: 'Error Pages' }),
    errorLogLink: container.getByRole('link', { name: 'Error Log' }),
    excelMenu: container.getByRole('menuitem', { name: 'Excel' }),
    zipMenu: container.getByRole('menuitem', { name: 'Zip' }),
    pdfLink: container.getByRole('link', { name: 'PDF' }),
    themeLink: container.getByRole('link', { name: 'Theme' }),
    clipboardLink: container.getByRole('link', { name: 'Clipboard' }),
    i18nLink: container.getByRole('link', { name: 'I18n' }),
    externalLink: container.getByRole('link', { name: 'External Link' }),
    donateLink: container.getByRole('link', { name: 'Donate' }),
});

export const locators = (container: Locator) => ({
    ...onLoadLocators(container),
    menubar: container.getByRole('menubar'),
});

export type OnLoadLocators = ReturnType<typeof onLoadLocators>;
export type Locators = ReturnType<typeof locators>;
