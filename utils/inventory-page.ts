import { expect } from '@playwright/test';
import { BasePage } from './base-page';

export class InventoryPage extends BasePage {
  url = '/inventory.html';
  title = 'Products';

  // Locators
  primaryHeader = () => this.page.getByTestId( 'primary-header' );
  inventoryList = () => this.page.getByTestId( 'inventory-list' );
  productItems = () => this.page.getByTestId( 'inventory-item' );
  productNames = () => this.page.getByTestId( 'inventory-item-name' );
  productPrices = () => this.page.getByTestId( 'inventory-item-price' );
  cartLink = () => this.page.getByTestId( 'shopping-cart-link' );
  sortProductsSelect = () => this.page.getByTestId( 'product-sort-container' );
  addItemToCartButton = ( itemName: string ) => this.page.getByTestId(
    `add-to-cart-${ itemName.toLowerCase().replace(/\s+/g, '-') }`
  );
  removeItemButton = ( itemName: string ) => this.page.getByTestId(
    `remove-${ itemName.toLowerCase().replace(/\s+/g, '-') }`
  );
  cartQuantityBadge = () => this.page.getByTestId( 'shopping-cart-badge' );

  // Actions
  async addItemToCart( itemName: string ) {
    await this.addItemToCartButton( itemName ).click();
  }

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
  
  async sortProducts( sortOption: 'az' | 'za' | 'lohi' | 'hilo' ) {
    await this.sortProductsSelect().selectOption( sortOption );
  }

  //Assertions
  async assertPageView() {
    await this.assertPageUrl();
    await this.assertPageTitle();
    await expect( this.primaryHeader() ).toContainText( 'Swag Labs' );
    await expect( this.inventoryList() ).toBeVisible();
  }
}