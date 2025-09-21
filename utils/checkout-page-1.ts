import { expect } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Checkout Step 1 page POM class
 */
export class CheckoutPage1 extends BasePage {
  url = '/checkout-step-one.html';
  title = 'Checkout: Your Information';

  // Locators
  checkoutInfo = () => this.page.locator( '.checkout_info' );
  firstNameInput = () => this.page.getByTestId( 'firstName' );
  lastNameInput = () => this.page.getByTestId( 'lastName' );
  postalCodeInput = () => this.page.getByTestId( 'postalCode' );
  continueButton = () => this.page.getByTestId( 'continue' );
  
  // Actions
  async fillCheckoutFormAndContinue( firstName: string, lastName: string, postalCode: string ) {
    await this.firstNameInput().fill( firstName);
    await this.lastNameInput().fill( lastName);
    await this.postalCodeInput().fill( postalCode);
    await this.continueButton().click();
    await this.page.waitForLoadState();
  }

  // Assertions
  async assertPageView() {
    await this.assertPageUrl();
    await this.assertPageTitle();
    await expect( this.checkoutInfo() ).toBeVisible();
  }
}