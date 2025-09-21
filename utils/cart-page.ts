import { expect } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Cart page POM class
 */
export class CartPage extends BasePage {
  url = '/cart.html';
  title = 'Your Cart';

  // Locators
  catrList = () => this.page.getByTestId( 'cart-list' );
  cartItemNames = () => this.page.getByTestId( 'inventory-item-name' );
  checkoutButton = () => this.page.getByTestId( 'checkout' );

  // Actions

  //Assertions
  async assertPageView() {
    await this.assertPageUrl();
    await this.assertPageTitle();
    await expect( this.catrList() ).toBeVisible();
  }

}