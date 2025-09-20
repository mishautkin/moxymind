import { expect, Page } from '@playwright/test';

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

  // Actions
  async visit(): Promise< void > {
    await this.page.goto( this.url );
    await this.page.waitForLoadState();
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