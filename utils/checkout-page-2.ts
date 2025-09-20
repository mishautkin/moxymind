import { expect } from '@playwright/test';
import { BasePage } from './base-page';

export class CheckoutPage2 extends BasePage {
  url = '/checkout-step-two.html';
  title = 'Checkout: Overview';

  // Locators
  catrList = () => this.page.getByTestId( 'cart-list' );
  checkoutItemNames = () => this.page.getByTestId( 'inventory-item-name' );
  subtotalLabel = () => this.page.getByTestId( 'subtotal-label' );
  taxLabel = () => this.page.getByTestId( 'tax-label' );
  totalLabel = () => this.page.getByTestId( 'total-label' );
  finishButton = () => this.page.getByTestId( 'finish' );
  
  // Actions
  
  // Assertions
  async assertPageView() {
    await this.assertPageUrl();
    await this.assertPageTitle();
    await expect( this.catrList() ).toBeVisible();
  }
}