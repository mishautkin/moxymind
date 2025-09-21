import { Page } from '@playwright/test';

/**
 * Inventory item class
 * Used on Inventory List, Cart, Checkout Step 2
 */
export class InventoryItem {
  page: Page;

  constructor( { page }: { page: Page } ) {
	this.page = page;
  }

  // Locators
  addItemToCartButton = ( itemName: string ) => this.page.getByTestId(
	`add-to-cart-${ itemName.toLowerCase().replace(/\s+/g, '-') }`
  );
  removeItemButton = ( itemName: string ) => this.page.getByTestId(
	`remove-${ itemName.toLowerCase().replace(/\s+/g, '-') }`
  );

  // Actions
  async addItemToCart( itemName: string ) {
	await this.addItemToCartButton( itemName ).click();
  }

  async removeItemFromCart( itemName: string ) {
	await this.removeItemButton( itemName ).click();
  }

  //Assertions
  
}