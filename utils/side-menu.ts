import { expect, Page } from '@playwright/test';

export class SideMenu {
  page: Page;

  constructor( { page }: { page: Page } ) {
    this.page = page;
  }

  // Locators
  openMenuButton = () => this.page.getByTestId( 'open-menu' );
  closeMenuButton = () => this.page.getByTestId( 'close-menu' );
  allItemsLink = () => this.page.getByTestId( 'inventory-sidebar-link' );
  aboutLink = () => this.page.getByTestId( 'about-sidebar-link' );
  logoutLink = () => this.page.getByTestId( 'logout-sidebar-link' );
  resetAppStateLink = () => this.page.getByTestId( 'reset-sidebar-link' );

  // Actions
  async open() {
    await this.openMenuButton().click( { force: true } );
    await expect( this.allItemsLink() ).toBeVisible();
  }

  async logout() {
    await this.logoutLink().click();
    await this.page.waitForLoadState();
  }
}