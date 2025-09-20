import { expect } from '@playwright/test';
import { BasePage } from './base-page';

export class CartPage extends BasePage {
  url = '/cart.html';
  title = 'Your Cart';

  // Locators
  catrList = () => this.page.getByTestId( 'cart-list' );
  cartItemNames = () => this.page.getByTestId( 'inventory-item-name' );
  removeItemButton = ( itemName: string ) => this.page.getByTestId(
    `remove-${ itemName.toLowerCase().replace(/\s+/g, '-') }`
  );
  cartQuantityBadge = () => this.page.getByTestId( 'shopping-cart-badge' );
  checkoutButton = () => this.page.getByTestId( 'checkout' );

  // Actions
  async removeItemFromCart( itemName: string ) {
    await this.removeItemButton( itemName ).click();
  }

  async getCartItemCount(): Promise<number> {
    const isVisible = await this.cartQuantityBadge().isVisible();
    if ( !isVisible ) {
      return 0;
    }
    const badgeText = await this.cartQuantityBadge().textContent();
    return parseInt( badgeText || '0' );
  }

  //Assertions
  async assertPageView() {
    await this.assertPageUrl();
    await this.assertPageTitle();
    await expect( this.catrList() ).toBeVisible();
  }

}