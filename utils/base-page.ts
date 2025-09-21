import { expect, Page } from '@playwright/test';

/**
 * Base POM class with common page methods
 */
export class BasePage {
  page: Page;
  url: string = '/';
  title: string = '';

  constructor( { page }: { page: Page } ) {
    this.page = page;
  }

  // Locators
  pageTitle = () => this.page.getByTestId( 'title' );
  errorMessage = () => this.page.getByTestId( 'error' );
  cartQuantityBadge = () => this.page.getByTestId( 'shopping-cart-badge' );

  // Actions
  async visit(): Promise< void > {
    await this.page.goto( this.url );
    await this.page.waitForLoadState();
  }

  async getCartItemCount(): Promise<number> {
    const isVisible = await this.cartQuantityBadge().isVisible();
    if ( !isVisible ) {
      return 0;
    }
    const badgeText = await this.cartQuantityBadge().textContent();
    return parseInt( badgeText || '0' );
  }

  // Assertions
  async assertPageUrl() {
    await expect( this.page ).toHaveURL( this.url );
  }

  async assertPageTitle() {
    await expect( this.pageTitle() ).toContainText( this.title );
  }

  async assertErrorMessage( errorMessage: string ) {
	await expect( this.errorMessage() ).toContainText( errorMessage );
  }
}