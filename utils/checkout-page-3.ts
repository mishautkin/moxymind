import { expect } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Checkout Step 3 page POM class
 */
export class CheckoutPage3 extends BasePage {
  url = '/checkout-complete.html';
  title = 'Checkout: Complete!';

  // Locators
  checkoutCompleteContainer = () => this.page.getByTestId( 'checkout-complete-container' );
  completeHeader = () => this.page.getByTestId( 'complete-header' );
  completeText = () => this.page.getByTestId( 'complete-text' );
  backHomeButton = () => this.page.getByTestId( 'back-to-products' );
  
  // Actions

  // Assertions
  async assertPageView() {
    await this.assertPageUrl();
    await this.assertPageTitle();
    await expect( this.checkoutCompleteContainer() ).toBeVisible();
  }

  async assertOrderComplete() {
    await expect( this.completeHeader() ).toContainText( 'Thank you for your order!' );
    await expect( this.completeText() ).toBeVisible();
  }
}