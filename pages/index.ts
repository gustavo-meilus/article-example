import { Page } from '@playwright/test';
import { LoginPage } from './login/login.page';

export const pageManager = (page: Page) => ({
    page,
    login: new LoginPage(page, './vue-element-admin/#/login'),
   });
   
   
   export type PageManager = ReturnType<typeof pageManager>;