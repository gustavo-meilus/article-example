import { BrowserContext, Page } from '@playwright/test';
import { HeaderMenuPage } from './common/header-menu/header-menu.component';
import { LeftMenuPage } from './common/left-menu/left-menu.component';
import { DashboardPage } from './dashboard/dashboard.page';
import { LoginPage } from './login/login.page';

export const pageManager = (page: Page, context: BrowserContext) => ({
    page,
    context,
    login: new LoginPage(page),
    dashboard: new DashboardPage(page),
    leftMenu: new LeftMenuPage(page),
    headerMenu: new HeaderMenuPage(page),
});
