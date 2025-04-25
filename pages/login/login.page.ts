import { Locator, Page } from '@playwright/test';
import { OnLoadLocators, Locators, onLoadLocators, locators } from './login.locators';
import { PageBase } from '../shared/page';


export class LoginPage extends PageBase {
    onLoadLocators: OnLoadLocators;
    locators: Locators;


    constructor(page: Page, url = '/') {
    super(page, url);
    this.locators = locators(page);
    this.onLoadLocators = onLoadLocators(page);
    }

    async executeLogin(username: string, password: string) {
        await this.locators.usernameTextbox.fill(username);
        await this.locators.passwordTextbox.fill(password);
        await this.locators.loginButton.click();
    }

    async changeLanguage(language: '中文' | 'English' | 'Español' | '日本語'){
        await this.locators.languagesButton.click();
        await this.locators.languageList.waitFor({state: 'visible'});
        await this.locators.languageList.getByText(language).waitFor({state: 'visible'});
        const isEnabled = await this.locators.languageList.getByText(language).isEnabled();
        if (isEnabled) {
            await this.locators.languageList.getByText(language).click();
        }
        await this.page.mouse.click(10, 10);
    }
}
