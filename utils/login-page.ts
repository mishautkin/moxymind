import { expect } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Login page POM class
 */
export class LoginPage extends BasePage {
  url = '/';

  // Locators
  loginContainer = () => this.page.getByTestId( 'login-container' );
  usernameInput = () => this.page.getByTestId( 'username' );
  passwordInput = () => this.page.getByTestId( 'password' );
  loginButton = () => this.page.getByTestId( 'login-button' );

  // Actions
  async login( username: string, password: string ) {
    await this.usernameInput().fill( username );
    await this.passwordInput().fill( password );
    await this.loginButton().click();
    await this.page.waitForLoadState();
  }

  // Assertions
  async assertPageView() {
    await this.assertPageUrl();
    await expect( this.loginContainer() ).toBeVisible();
    await expect( this.loginButton() ).toBeVisible();
  }
}