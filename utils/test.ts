import { test as base, expect } from '@playwright/test';
import { TestExtend } from '../resources/types';
import {
	LoginPage,
	InventoryPage,
  InventoryItem,
	SideMenu,
	CartPage,
	CheckoutPage1,
	CheckoutPage2,
	CheckoutPage3,
} from '.';

const test = base.extend< TestExtend > ( {
  loginPage: async ( { page }, use ) => {
    await use( new LoginPage( { page } ) );
  },
  inventoryPage: async ( { page }, use ) => {
    await use( new InventoryPage( { page } ) );
  },
  inventoryItem: async ( { page }, use ) => {
    await use( new InventoryItem( { page } ) );
  },
  sideMenu: async ( { page }, use ) => {
    await use( new SideMenu( { page } ) );
  },
  cartPage: async ( { page }, use ) => {
    await use( new CartPage( { page } ) );
  },
  checkoutPage1: async ( { page }, use ) => {
    await use( new CheckoutPage1( { page } ) );
  },
  checkoutPage2: async ( { page }, use ) => {
    await use( new CheckoutPage2( { page } ) );
  },
  checkoutPage3: async ( { page }, use ) => {
    await use( new CheckoutPage3( { page } ) );
  },
} );

export { test, expect };