import { Page } from '@playwright/test';
import { PageBase } from '../base/page.base';
import {
    Locators,
    locators,
    OnLoadLocators,
    onLoadLocators,
} from './login.locators';

export class LoginPage extends PageBase {
    readonly url = './vue-element-admin/#/login';
    readonly onLoadLocators: OnLoadLocators;
    readonly locators: Locators;

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

    async changeLanguage(language: '中文' | 'English' | 'Español' | '日本語') {
        await this.locators.languagesButton.click();
        await this.locators.languageList.waitFor({ state: 'visible' });
        await this.locators.languageList
            .getByText(language)
            .waitFor({ state: 'visible' });
        const isEnabled = await this.locators.languageList
            .getByText(language)
            .isEnabled();
        if (isEnabled) {
            await this.locators.languageList.getByText(language).click();
        }
        await this.page.mouse.click(10, 10);
    }
}
