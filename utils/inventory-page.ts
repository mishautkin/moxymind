import { expect } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Inventory page POM class
 */
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

  // Actions  
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